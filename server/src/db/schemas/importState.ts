import { Schema } from 'mongoose'

import { ImportState } from '../../shared/types'

export const ImportStateSchema = new Schema<ImportState>({
    total: { type: Number, required: true },
    current: { type: Number, default: 0 },
    metadata: {},
    user: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    status: {
        type: String,
        enum: ['progress', 'success', 'failure', 'failure-removed'],
        default: 'progress',
    },
    createdAt: { type: Date, default: new Date() },
})
