import { Router } from 'express'
import { logged } from '../utils/middleware'
import { LoggedRequest } from '../utils/types'

export const indexRouter = Router()

indexRouter.post('/logout', async (_, res) => {
    res.clearCookie('token')
    res.status(200).end()
})

indexRouter.get('/me', logged, async (req, res) => {
    const { user } = req as LoggedRequest
    res.status(200).send(user)
})
