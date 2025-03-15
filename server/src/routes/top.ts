import { Router } from 'express'
import { logged, validating } from '../utils/middleware'
import { LoggedRequest, TypedPayload } from '../utils/types'
import { logger } from '../utils/logger'
import { intervalSchema } from './collab'
import { getTopArtists, getTopGenres, getTopSongs } from '../services/topService'

export const topRouter = Router()

topRouter.get('/songs', validating(intervalSchema, 'query'), logged, async (req, res) => {
    const { user } = req as LoggedRequest
    const { from, to } = req.query as unknown as TypedPayload<typeof intervalSchema>

    try {
        const result = await getTopSongs(user._id.toString(), from, to, 50)
        res.status(200).send(result)
    } catch (e) {
        logger.error(e)
        res.status(500).end()
    }
})

topRouter.get('/artists', validating(intervalSchema, 'query'), logged, async (req, res) => {
    const { user } = req as LoggedRequest
    const { from, to } = req.query as unknown as TypedPayload<typeof intervalSchema>

    try {
        const result = await getTopArtists(user._id.toString(), from, to, 50)
        res.status(200).send(result)
    } catch (e) {
        logger.error(e)
        res.status(500).end()
    }
})

topRouter.get('/genres', validating(intervalSchema, 'query'), logged, async (req, res) => {
    const { user } = req as LoggedRequest
    const { from, to } = req.query as unknown as TypedPayload<typeof intervalSchema>

    try {
        const result = await getTopGenres(user._id.toString(), from, to, 50)
        res.status(200).send(result)
    } catch (e) {
        logger.error(e)
        res.status(500).end()
    }
})
