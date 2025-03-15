import { Schema } from 'mongoose'
import { Infos } from '../../shared/types'

export const InfosSchema = new Schema<Infos>(
    {
        owner: { type: Schema.Types.ObjectId, ref: 'User' },

        id: { type: String },
        albumId: { type: String },
        primaryArtistId: { type: String },
        artistIds: [{ type: String }],

        durationMs: { type: Number },

        played_at: { type: Date },
    },
    { toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

InfosSchema.virtual('track', {
    ref: 'Track',
    localField: 'id',
    foreignField: 'id',
    justOne: true,
})

InfosSchema.virtual('album', {
    ref: 'Album',
    localField: 'albumId',
    foreignField: 'id',
    justOne: true,
})

InfosSchema.virtual('artist', {
    ref: 'Artist',
    localField: 'primaryArtistId',
    foreignField: 'id',
    justOne: true,
})

InfosSchema.index({ owner: 1, played_at: 1, id: 1 }, { unique: false })
