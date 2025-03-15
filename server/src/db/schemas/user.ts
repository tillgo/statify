import { Schema } from 'mongoose'
import { User } from '../../shared/types'

export const UserSchema = new Schema<User>(
    {
        username: { type: String, required: true, index: true },
        admin: { type: Boolean, default: false },
        spotifyId: { type: String, required: true, unique: true, index: true },
        expiresIn: { type: Number, default: 0 },
        accessToken: { type: String, default: null },
        refreshToken: { type: String, default: null },
        lastTimestamp: { type: Number, default: 0 },
        settings: {
            darkMode: {
                type: String,
                enum: ['system', 'dark', 'light'],
                default: 'system',
            },
        },
        lastImport: { type: String, default: null },
        publicToken: { type: String, default: null, index: true },
        firstListenedAt: { type: Date },
    },
    { toJSON: { virtuals: true }, toObject: { virtuals: true } }
)
