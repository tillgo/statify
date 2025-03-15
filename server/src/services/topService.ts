import mongoose, { PipelineStage } from 'mongoose'
import {
    basicMatchUser,
    lightAlbumLookupPipeline,
    lightArtistLookupPipeline,
    lightArtistsLookupPipeline,
    lightTrackLookupPipeline,
} from '../db/pipelineHelpers'
import { InfosModel } from '../db/models'
import { TopArtist, TopGenre, TopSong } from '../shared/api.types'

export const getTopSongs = async (
    userId: string,
    start: Date,
    end: Date,
    limit: number
): Promise<TopSong[]> => {
    return InfosModel.aggregate([
        ...matchAndAddCount(userId, start, end),
        {
            $group: {
                _id: '$id',
                amount: { $sum: `$amount` },
            },
        },
        ...sortAndLimit(limit),
        ...lightTrackLookupPipeline('_id'),
        ...lightAlbumLookupPipeline('track.album'),
        lightArtistsLookupPipeline('track.artists'),
    ]).exec()
}

export const getTopArtists = async (
    userId: string,
    start: Date,
    end: Date,
    limit: number
): Promise<TopArtist[]> => {
    return InfosModel.aggregate([
        ...matchAndAddCount(userId, start, end),
        {
            $group: {
                _id: '$primaryArtistId',
                amount: { $sum: `$amount` },
            },
        },
        ...sortAndLimit(limit),
        ...lightArtistLookupPipeline('_id'),
    ]).exec()
}

export const getTopGenres = async (
    userId: string,
    start: Date,
    end: Date,
    limit: number
): Promise<TopGenre[]> => {
    return InfosModel.aggregate([
        ...matchAndAddCount(userId, start, end),
        {
            $group: {
                _id: '$primaryArtistId',
                amount: { $sum: `$amount` },
            },
        },
        ...lightArtistLookupPipeline('_id'),
        {
            $unwind: '$artist.genres',
        },
        {
            $group: {
                _id: '$artist.genres',
                amount: { $sum: `$amount` },
            },
        },
        ...sortAndLimit(limit),
    ]).exec()
}

const matchAndAddCount = (userId: string, start: Date, end: Date): PipelineStage[] => [
    {
        $match: basicMatchUser(userId, start, end),
    },
    {
        $addFields: {
            amount: {
                $cond: [{ $eq: ['$owner', new mongoose.Types.ObjectId(userId)] }, 1, 0],
            },
        },
    },
]

const sortAndLimit = (limit: number): PipelineStage[] => [
    {
        $sort: {
            amount: -1,
        },
    },
    { $limit: limit },
]
