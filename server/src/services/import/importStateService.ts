import { ImportStateModel } from '../../db/models'
import { ImportState, ImportStateStatus } from './import.types'

export const createImportState = (userId: string, state: Omit<ImportState, '_id' | 'user'>) =>
    ImportStateModel.create({ user: userId, ...state })

export const setImportStateStatus = (id: string, status: ImportStateStatus) =>
    ImportStateModel.findByIdAndUpdate(id, { status }).lean().exec()

export const getImportState = (id: string) =>
    ImportStateModel.findById<ImportState>(id).lean().exec()

export const setImportStateCurrent = (id: string, current: number) =>
    ImportStateModel.findByIdAndUpdate(id, { current }).lean().exec()

export const getUserImportState = async (userId: string) =>
    ImportStateModel.find({ user: userId }).sort({ createdAt: -1 }).lean().exec()

export const fixRunningImportsAtStart = () =>
    ImportStateModel.updateMany({ status: 'progress' }, { status: 'failure' }).lean().exec()
