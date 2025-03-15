import mongoose, { PipelineStage } from 'mongoose'
import { InfosModel } from '../db/models'
import {
    basicMatchUsers,
    lightAlbumLookupPipeline,
    lightArtistLookupPipeline,
    lightArtistsLookupPipeline,
    lightTrackLookupPipeline,
} from '../db/pipelineHelpers'
import { CollabTopArtist, CollabTopGenre, CollabTopSong } from '../shared/api.types'

export const getCollabTopSongs = (
    userIds: string[],
    start: Date,
    end: Date,
    limit: number
): Promise<CollabTopSong[]> => {
    return InfosModel.aggregate([
        ...matchAndAddCount(userIds, start, end),
        {
            $group: {
                _id: '$id',
                ...Object.fromEntries(
                    userIds.map((userId) => [`amount_${userId}`, { $sum: `$amount_${userId}` }])
                ),
            },
        },
        ...sortAndLimitByScore(userIds, limit),
        ...lightTrackLookupPipeline('_id'),
        ...lightAlbumLookupPipeline('track.album'),
        lightArtistsLookupPipeline('track.artists'),
    ]).exec()
}

export const getCollabTopArtists = (
    userIds: string[],
    start: Date,
    end: Date,
    limit: number
): Promise<CollabTopArtist[]> => {
    return InfosModel.aggregate([
        ...matchAndAddCount(userIds, start, end),
        {
            $group: {
                _id: '$primaryArtistId',
                ...Object.fromEntries(
                    userIds.map((userId) => [`amount_${userId}`, { $sum: `$amount_${userId}` }])
                ),
            },
        },
        ...sortAndLimitByScore(userIds, limit),
        ...lightArtistLookupPipeline('_id'),
    ]).exec()
}

export const getCollabTopGenres = (
    userIds: string[],
    start: Date,
    end: Date,
    limit: number
): Promise<CollabTopGenre[]> => {
    return InfosModel.aggregate([
        ...matchAndAddCount(userIds, start, end),
        {
            $group: {
                _id: '$primaryArtistId',
                ...Object.fromEntries(
                    userIds.map((userId) => [`amount_${userId}`, { $sum: `$amount_${userId}` }])
                ),
            },
        },
        ...lightArtistLookupPipeline('_id'),
        {
            $unwind: '$artist.genres',
        },
        {
            $group: {
                _id: '$artist.genres',
                ...Object.fromEntries(
                    userIds.map((userId) => [`amount_${userId}`, { $sum: `$amount_${userId}` }])
                ),
            },
        },
        ...sortAndLimitByScore(userIds, limit),
    ]).exec()
}

const matchAndAddCount = (userIds: string[], start: Date, end: Date): PipelineStage[] => [
    {
        $match: basicMatchUsers(userIds, start, end),
    },
    {
        $addFields: Object.fromEntries(
            userIds.map((userId) => [
                `amount_${userId}`,
                { $cond: [{ $eq: ['$owner', new mongoose.Types.ObjectId(userId)] }, 1, 0] },
            ])
        ),
    },
]

const sortAndLimitByScore = (userIds: string[], limit: number): PipelineStage[] => [
    {
        $addFields: {
            score: {
                $cond: {
                    if: {
                        $or: userIds.map((userId) => ({
                            $eq: [`$amount_${userId}`, 0],
                        })),
                    },
                    then: {
                        $divide: [
                            {
                                $sum: userIds.map((userId) => `$amount_${userId}`),
                            },
                            10000,
                        ],
                    },
                    else: {
                        $sum: userIds.map((userId) => ({
                            $pow: [`$amount_${userId}`, 1 / 16],
                        })),
                    },
                },
            },
        },
    },
    {
        $sort: {
            score: -1,
        },
    },
    { $limit: limit },
]
