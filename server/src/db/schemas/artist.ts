import { Schema } from 'mongoose'
import { Artist } from '../../shared/types'

export const ArtistSchema = new Schema<Artist>(
    {
        external_urls: Object,
        followers: Object,
        genres: [String],
        href: String,
        id: { type: String, unique: true },
        images: [Object],
        name: String,
        popularity: Number,
        type: String,
        //uri: String,
    },
    { toJSON: { virtuals: true }, toObject: { virtuals: true } }
)
