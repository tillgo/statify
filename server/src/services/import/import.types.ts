import { Types } from 'mongoose'

export type ImportStateStatus = 'progress' | 'success' | 'failure' | 'failure-removed'

export type ImportState = {
    _id: Types.ObjectId
    user: Types.ObjectId
    current: number
    total: number
    status: ImportStateStatus
    createdAt: Date
    metadata: string[]
}
