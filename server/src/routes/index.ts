import { Router } from 'express'
import { LoggedRequest, TypedPayload } from '../utils/types'
import { z } from 'zod'
import { toDate } from '../utils/zod'
import { logged, validating } from '../utils/middleware'
import { logger } from '../utils/logger'
import { getSongHistoryItems } from '../services/historyService'
import { HistoryResponse } from '../shared/api.types'

export const indexRouter = Router()

indexRouter.post('/logout', async (_, res) => {
    res.clearCookie('token')
    res.status(200).end()
})

indexRouter.get('/me', logged, async (req, res) => {
    const { user } = req as LoggedRequest
    res.status(200).send(user)
})

const intervalSchema = z.object({
    before: z.preprocess(toDate, z.date()),
})

indexRouter.get('/history', logged, validating(intervalSchema, 'query'), async (req, res) => {
    const { user } = req as LoggedRequest
    const { before } = req.query as unknown as TypedPayload<typeof intervalSchema>

    try {
        console.log(user)
        const items = await getSongHistoryItems(user._id.toString(), before, 50)

        console.log(items)

        const result: HistoryResponse = {
            items,
            next: items[49]?.played_at,
        }
        res.status(200).send(result)
    } catch (e) {
        logger.error(e)
        res.status(500).end()
    }
})
