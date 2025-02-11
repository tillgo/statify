import { Types } from 'mongoose'
import { logger } from '../../utils/logger'
import { getUserFromField } from '../userService'
import { HistoryImporter } from './HistoryImporter'
import { createImportState, getImportState, setImportStateStatus } from './importStateService'
import { clearCache } from './cache'
import { ImportState } from '../../shared/types'

const userImporters: {
    [userId: string]: HistoryImporter
} = {}

export function canUserImport(userId: string) {
    return !(userId in userImporters)
}

export async function cleanupImport(existingStateId: string) {
    const importState = await getImportState(existingStateId)
    if (!importState) return
    if (importState.status !== 'failure') return

    await setImportStateStatus(existingStateId, 'failure-removed')
    const user = await getUserFromField('_id', importState._id, false)
    if (!user) {
        return
    }
    const historyImporter = new HistoryImporter(user)
    try {
        await historyImporter.cleanup(importState.metadata)
    } catch (e) {
        logger.error('Failed to cleanup HistoryImporter')
    }
}

export async function runImporter(
    existingStateId: string | null,
    userId: string,
    metadata: string[],
    initDone: (success: boolean) => void
) {
    const user = await getUserFromField('_id', new Types.ObjectId(userId), true)
    if (!user) {
        logger.error(`User with id ${userId} was not found`)
        return initDone(false)
    }
    if (!user.accessToken || !user.refreshToken) {
        logger.error(`User ${user.username} has no accessToken or no refreshToken`)
        return initDone(false)
    }

    const historyImporter = new HistoryImporter(user)
    if (userId in userImporters) {
        return initDone(false)
    }
    userImporters[userId] = historyImporter

    clearCache(userId)
    let existingState: ImportState | null = null
    try {
        if (existingStateId) {
            existingState = (await getImportState(existingStateId)) ?? null
        }
        const initedMetadata = await historyImporter.init(existingState, metadata)
        if (!initedMetadata) {
            if (existingState) {
                await cleanupImport(existingState._id.toString())
            }
            return initDone(false)
        }
        if (existingState) {
            await setImportStateStatus(existingState._id.toString(), 'progress')
        }
        if (!existingState) {
            const data = {
                current: 0,
                total: initedMetadata.total,
                metadata,
                status: 'progress',
            } as ImportState
            existingState = (await createImportState(userId, data)) as unknown as ImportState
        }
        initDone(true)
        await historyImporter.run(existingState._id.toString())
        await historyImporter.cleanup(metadata)
        await setImportStateStatus(existingState._id.toString(), 'success')
    } catch (e) {
        if (existingState) {
            await setImportStateStatus(existingState._id.toString(), 'failure')
        }
        logger.error(e)
        logger.error(
            'This import failed, but metadata is kept so that you can retry it later in the settings'
        )
    }

    clearCache(userId)
    delete userImporters[userId]
}
