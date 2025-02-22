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
                _id: '$id',
                ...Object.fromEntries(
                    users.map((user) => [
                        `amount_${user.toString()}`,
                        { $sum: `$amount_${user.toString()}` },
                    ])
                ),
            },
        },
        {
            $addFields: {
                score: {
                    $cond: {
                        if: {
                            $or: users.map((user) => ({
                                $eq: [`$amount_${user._id.toString()}`, 0],
                            })),
                        },
                        then: {
                            $divide: [
                                {
                                    $sum: users.map((user) => `$amount_${user._id.toString()}`),
                                },
                                10000,
                            ],
                        },
                        else: {
                            $sum: users.map((user) => ({
                                $pow: [`$amount_${user._id.toString()}`, 1 / 8],
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
        ...lightTrackLookupPipeline('_id'),
        ...lightAlbumLookupPipeline('track.album'),
        lightArtistLookupPipeline('track.artists'),
    ]).exec()
}
