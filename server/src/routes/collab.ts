import { Router } from 'express'
import { logged, validating } from '../utils/middleware'
import { z } from 'zod'
import { toDate } from '../utils/zod'
import { timesplits } from '../shared/util.types'
import { LoggedRequest, TypedPayload } from '../utils/types'
import { getCollaborativeBestSongs } from '../services/collabService'
import { logger } from '../utils/logger'

export const collabRouter = Router()

const intervalPerSchema = z.object({
    start: z.preprocess(
        toDate,
        z.date().default(() => new Date(Date.now() - 1000 * 60 * 60 * 24 * 365 * 20))
    ),
    end: z.preprocess(
        toDate,
        z.date().default(() => new Date())
    ),
    timeSplit: z.enum(timesplits).default('day'),
})

const collaborativeSchema = intervalPerSchema.merge(
    z.object({
        otherIds: z.array(z.string()).min(1),
    })
)

collabRouter.get(
    '/top/songs',
    validating(collaborativeSchema, 'query'),
    logged,
    async (req, res) => {
        const { user } = req as LoggedRequest
        const { start, end, otherIds } = req.query as unknown as TypedPayload<
            typeof collaborativeSchema
        >

        try {
            const result = await getCollaborativeBestSongs(
                [user._id.toString(), ...otherIds.filter((e) => e.length > 0)],
                start,
                end,
                50
            )
            res.status(200).send(result)
        } catch (e) {
            logger.error(e)
            res.status(500).end()
        }
    }
)
