import { Router } from 'express'
import { z } from 'zod'
import multer from 'multer'
import { LoggedRequest, TypedPayload } from '../utils/types'
import { logged, notAlreadyImporting, validating } from '../utils/middleware'
import { logger } from '../utils/logger'
import { canUserImport, cleanupImport, runImporter } from '../services/import/importService'
import { getImportState, getUserImportState } from '../services/import/importStateService'

export const router = Router()

const upload = multer({
    dest: '/tmp/imports/',
    limits: {
        files: 50,
        fileSize: 1024 * 1024 * 20, // 20 mo
    },
})

router.post(
    '/upload',
    upload.array('imports', 50),
    logged,
    notAlreadyImporting,
    async (req, res) => {
        const { files, user } = req as LoggedRequest

        if (!files) {
            res.status(400).end()
            return
        }

        if (!canUserImport(user._id.toString())) {
            res.status(400).send({ code: 'ALREADY_IMPORTING' })
            return
        }

        try {
            void runImporter(
                null,
                user._id.toString(),
                (files as Express.Multer.File[]).map((f) => f.path),
                (success) => {
                    if (success) {
                        res.status(200).send({ code: 'IMPORT_STARTED' })
                        return
                    }
                    res.status(400).send({ code: 'IMPORT_INIT_FAILED' })
                    return
                }
            ).catch(logger.error)
        } catch (e) {
            logger.error(e)
            res.status(500).end()
        }
    }
)

const retrySchema = z.object({
    existingStateId: z.string(),
})

router.post('/retry', validating(retrySchema), logged, notAlreadyImporting, async (req, res) => {
    const { user } = req as LoggedRequest
    const { existingStateId } = req.body as TypedPayload<typeof retrySchema>

    const importState = await getImportState(existingStateId)
    if (!importState || importState.user.toString() !== user._id.toString()) {
        res.status(404).end()
        return
    }

    if (importState.status !== 'failure') {
        res.status(400).end()
        return
    }

    try {
        runImporter(
            importState._id.toString(),
            user._id.toString(),
            importState.metadata,
            (success) => {
                if (success) {
                    res.status(200).send({ code: 'IMPORT_STARTED' })
                    return
                }
                res.status(400).send({ code: 'IMPORT_INIT_FAILED' })
                return
            }
        ).catch(logger.error)
    } catch (e) {
        logger.error(e)
        res.status(500).end()
    }
})

const cleanupImportSchema = z.object({
    id: z.string(),
})

router.delete('/clean/:id', validating(cleanupImportSchema, 'params'), logged, async (req, res) => {
    const { user } = req as LoggedRequest
    const { id } = req.params as TypedPayload<typeof cleanupImportSchema>

    try {
        const importState = await getImportState(id)
        if (!importState) {
            res.status(404).end()
            return
        }
        if (importState.user.toString() !== user._id.toString()) {
            res.status(404).end()
            return
        }
        await cleanupImport(importState._id.toString())
        res.status(204).end()
    } catch (e) {
        logger.error(e)
        res.status(500).end()
    }
})

router.get('/all', logged, async (req, res) => {
    const { user } = req as LoggedRequest

    try {
        const state = await getUserImportState(user._id.toString())
        res.status(200).send(state)
    } catch (e) {
        logger.error(e)
        res.status(500).end()
    }
})
