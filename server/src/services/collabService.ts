import mongoose from 'mongoose'
import { InfosModel } from '../db/models'
import {
    basicMatchUsers,
    lightAlbumLookupPipeline,
    lightArtistLookupPipeline,
    lightTrackLookupPipeline,
} from '../db/pipelineHelpers'

export const getCollaborativeBestSongs = (
    _users: string[],
    start: Date,
    end: Date,
    limit: number
) => {
    const users = _users.map((u) => new mongoose.Types.ObjectId(u))
    return InfosModel.aggregate([
        {
            $match: basicMatchUsers(_users, start, end),
        },
        {
            $addFields: Object.fromEntries(
                users.map((user) => [
                    `amount_${user.toString()}`,
                    { $cond: [{ $eq: ['$owner', user] }, 1, 0] },
                ])
            ),
        },
        {
            $group: {
                _id: null,
                data: { $push: '$$ROOT' },
                ...Object.fromEntries(
                    users.map((user) => [
                        `total_${user.toString()}`,
                        { $sum: `$amount_${user.toString()}` },
                    ])
                ),
            },
        },
        { $unwind: '$data' },
        {
            $group: {
                _id: '$data.id',
                ...Object.fromEntries(
                    users.map((user) => [
                        `amount_${user.toString()}`,
                        { $sum: `$data.amount_${user.toString()}` },
                    ])
                ),
                ...Object.fromEntries(
                    users.map((user) => [
                        `total_${user.toString()}`,
                        { $first: `$total_${user.toString()}` },
                    ])
                ),
            },
        },
        {
            $addFields: Object.fromEntries(
                users.map((user) => [
                    `percent_${user.toString()}`,
                    { $divide: [`$amount_${user.toString()}`, `$total_${user.toString()}`] },
                ])
            ),
        },
        {
            $addFields: {
                avg_ratio: {
                    $divide: [
                        { $sum: users.map((user) => `$percent_${user.toString()}`) },
                        users.length,
                    ],
                },
                min_ratio: {
                    $min: users.map((user) => `$percent_${user.toString()}`),
                },
            },
        },
        {
            $addFields: {
                combined_score: {
                    $cond: {
                        if: { $eq: ['$minima', 0] },
                        then: 0,
                        else: { $sum: ['$avg_ratio', { $multiply: ['$min_ratio', 3] }] },
                    },
                },
            },
        },
        {
            $sort: {
                combined_score: -1,
            },
        },
        { $limit: limit },
        ...lightTrackLookupPipeline('_id'),
        ...lightAlbumLookupPipeline('track.album'),
        lightArtistLookupPipeline('track.artists'),
    ]).exec()
}
