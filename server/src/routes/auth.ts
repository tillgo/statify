import { Request, Response, Router } from 'express'
import { sign } from 'jsonwebtoken'
import { z } from 'zod'
import { getEnv } from '../utils/env'
import { Spotify } from '../utils/oauth/Provider'
import { logged, validating, withHttpClient } from '../utils/middleware'
import { SpotifyRequest, TypedPayload } from '../utils/types'
import { createUser, getUserFromField, storeInUser } from '../services/userService'

export const authRouter = Router()

function storeTokenInCookie(request: Request, response: Response, token: string) {
    response.cookie('token', token, {
        sameSite: getEnv('NODE_ENV') === 'production' ? 'strict' : 'lax',
        httpOnly: true,
        secure: request.secure,
    })
}

const OAUTH_COOKIE_NAME = 'oauth'
const spotifyCallbackOAuthCookie = z.object({
    state: z.string(),
})
type OAuthCookie = z.infer<typeof spotifyCallbackOAuthCookie>

authRouter.get('/spotify', async (req, res) => {
    const { url, state } = await Spotify.getRedirect()
    const oauthCookie: OAuthCookie = {
        state,
    }

    res.cookie(OAUTH_COOKIE_NAME, oauthCookie, {
        sameSite: 'lax',
        httpOnly: true,
        secure: req.secure,
    })

    res.redirect(url)
})

const spotifyCallback = z.object({
    code: z.string(),
    state: z.string(),
})
authRouter.get('/spotify/callback', validating(spotifyCallback, 'query'), async (req, res) => {
    const { query } = req
    const { code, state } = query as TypedPayload<typeof spotifyCallback>

    try {
        const cookie = spotifyCallbackOAuthCookie.parse(req.cookies[OAUTH_COOKIE_NAME])

        if (state !== cookie.state) {
            throw new Error('State does not match')
        }

        const infos = await Spotify.exchangeCode(code, cookie.state)

        const client = Spotify.getHttpClient(infos.accessToken)
        const { data: spotifyMe } = await client.get('/me')

        let user = await getUserFromField('spotifyId', spotifyMe.id, false)
        if (!user) {
            user = await createUser(spotifyMe.display_name, spotifyMe.id)
        }
        await storeInUser('_id', user._id, infos)

        const jwtSecret = getEnv('JWT_SECRET')
        if (!jwtSecret) {
            throw new Error('No private data found, cannot sign JWT')
        }
        const token = sign({ userId: user._id.toString() }, jwtSecret, {
            expiresIn: '24h',
        })
        storeTokenInCookie(req, res, token)
    } finally {
        res.clearCookie(OAUTH_COOKIE_NAME)
    }
    return res.redirect(getEnv('CLIENT_ENDPOINT'))
})

authRouter.get('/spotify/me', logged, withHttpClient, async (req, res) => {
    const { client } = req as SpotifyRequest

    try {
        const me = await client.me()
        res.status(200).send(me)
    } catch (e) {
        res.status(500).send({ code: 'SPOTIFY_ERROR' })
    }
})
