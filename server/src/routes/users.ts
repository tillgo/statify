import { Router } from 'express'
import { getAllUsers } from '../services/userService'

export const usersRouter = Router()

usersRouter.get('/', async (_, res) => {
    const users = await getAllUsers()
    res.status(200).send(users)
})
