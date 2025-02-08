import { Schema } from 'mongoose'
import { Track } from '../../shared/types'

export const TrackSchema = new Schema<Track>(
    {
        album: { type: String, index: true }, // Id of the album
        artists: { type: [String], index: true }, // Ids of artists
        available_markets: [String],
        disc_number: Number,
        duration_ms: Number,
        explicit: Boolean,
        external_ids: Object,
        external_urls: Object,
        href: String,
        id: { type: String, unique: true },
        is_local: Boolean,
        name: String,
        popularity: Number,
        preview_url: String,
        track_number: Number,
        type: String,
        uri: String,
    },
    { toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

TrackSchema.virtual('full_album', {
    ref: 'Album',
    localField: 'album',
    foreignField: 'id',
    justOne: true,
})

TrackSchema.virtual('full_artist', {
    ref: 'Artist',
    localField: 'artists',
    foreignField: 'id',
    justOne: false,
})
