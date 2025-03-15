import 'express-async-errors' // This line is required to handle async errors in Express
import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path from 'path'
import { getEnv, parseEnv } from './utils/env'
import { dbLoop } from './services/syncLoop/looper'
import { logger } from './utils/logger'
import { fixRunningImportsAtStart } from './services/import/importStateService'
import { authRouter } from './routes/auth'
import { importRouter } from './routes/import'
import { indexRouter } from './routes'
import { collabRouter } from './routes/collab'
import { usersRouter } from './routes/users'
import { topRouter } from './routes/top'
import { logged } from './utils/middleware'

// load env variables (prod: env vars, dev: .env file)
if (process.env.NODE_ENV !== 'production') {
    dotenv.config()
}
parseEnv()

const app = express()
mongoose.connect(getEnv('MONGO_URI')).then(() => {
    logger.info('[server]: Connected to MongoDB')

    fixRunningImportsAtStart().catch(logger.error)
    dbLoop().catch(logger.error)
})

if (getEnv('NODE_ENV') !== 'production') {
    app.use(
        cors({
            origin: getEnv('CLIENT_ENDPOINT'),
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Cache-Control'],
        })
    )
}

// serve static frontend and assets
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(cookieParser())

app.use('/api', indexRouter)
app.use('/api/auth', authRouter)
app.use('/api/import', logged, importRouter)
app.use('/api/collab', logged, collabRouter)
app.use('/api/users', logged, usersRouter)
app.use('/api/top', logged, topRouter)

// serve index.html for all other routes
// @ts-ignore
app.use((req, res) => {
    if (req.path.startsWith('/api')) {
        return res.status(404).send({ message: 'Not found' })
    }
    res.status(200).sendFile(path.join(__dirname, 'public', 'index.html'))
})

const port = getEnv('PORT', 8080)
app.listen(port, () => {
    logger.info(`[server]: Server is running at port ${port}`)
})
