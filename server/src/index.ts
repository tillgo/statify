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
import { router as authRouter } from './routes/auth'
import { router as importRouter } from './routes/import'

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

// serve static frontend and assets
app.use(express.static(path.join(__dirname, 'public')))

app.use(express.json())
app.use(cookieParser())
if (getEnv('NODE_ENV') !== 'production') {
    app.use(cors({ origin: '*' }))
}

app.use('/api/auth', authRouter)
app.use('/api/import', importRouter)

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
