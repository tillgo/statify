import { Router } from 'express'
import { validating } from '../utils/middleware'
import { z } from 'zod'
import { toDate } from '../utils/zod'
import { LoggedRequest, TypedPayload } from '../utils/types'
import {
    getCollabTopArtists,
    getCollabTopGenres,
    getCollabTopSongs,
} from '../services/collabService'
import { logger } from '../utils/logger'

export const collabRouter = Router()

export const intervalSchema = z.object({
    from: z.preprocess(
        toDate,
        z.date().default(() => new Date(0))
    ),
    to: z.preprocess(
        toDate,
        z.date().default(() => new Date())
    ),
})

const collaborativeSchema = intervalSchema.merge(
    z.object({
        otherIds: z.array(z.string()).min(1),
    })
)

collabRouter.get('/top/songs', validating(collaborativeSchema, 'query'), async (req, res) => {
    const { user } = req as LoggedRequest
    const { from, to, otherIds } = req.query as unknown as TypedPayload<typeof collaborativeSchema>

    try {
        const result = await getCollabTopSongs(
            [user._id.toString(), ...otherIds.filter((e) => e.length > 0)],
            from,
            to,
            50
        )
        res.status(200).send(result)
    } catch (e) {
        logger.error(e)
        res.status(500).end()
    }
})

collabRouter.get('/top/artists', validating(collaborativeSchema, 'query'), async (req, res) => {
    const { user } = req as LoggedRequest
    const { from, to, otherIds } = req.query as unknown as TypedPayload<typeof collaborativeSchema>

    try {
        const result = await getCollabTopArtists(
            [user._id.toString(), ...otherIds.filter((e) => e.length > 0)],
            from,
            to,
            50
        )
        res.status(200).send(result)
    } catch (e) {
        logger.error(e)
        res.status(500).end()
    }
})

collabRouter.get('/top/genres', validating(collaborativeSchema, 'query'), async (req, res) => {
    const { user } = req as LoggedRequest
    const { from, to, otherIds } = req.query as unknown as TypedPayload<typeof collaborativeSchema>

    try {
        const result = await getCollabTopGenres(
            [user._id.toString(), ...otherIds.filter((e) => e.length > 0)],
            from,
            to,
            50
        )
        res.status(200).send(result)
    } catch (e) {
        logger.error(e)
        res.status(500).end()
    }
})
