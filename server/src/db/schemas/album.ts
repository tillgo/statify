import { Schema } from 'mongoose'
import { Album } from '../../shared/types'

export const AlbumSchema = new Schema<Album>(
    {
        album_type: String,
        artists: { type: [String], index: true },
        //available_markets: [String],
        copyrights: [Object],
        external_ids: Object,
        //external_urls: Object,
        genres: [String],
        href: String,
        id: { type: String, unique: true },
        images: [Object],
        name: String,
        popularity: Number,
        release_date: String,
        release_date_precision: String,
        //  "tracks": ,
        type: String,
        //uri: String,
    },
    { toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

AlbumSchema.virtual('artist', {
    ref: 'Artist',
    localField: 'artists',
    foreignField: 'id',
    justOne: false,
})
