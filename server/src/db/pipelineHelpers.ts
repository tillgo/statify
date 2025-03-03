import { PipelineStage, Types } from 'mongoose'

export const basicMatchUsers = (userIds: string[] | Types.ObjectId[], start: Date, end: Date) => ({
    owner: {
        $in:
            userIds[0] instanceof Types.ObjectId
                ? userIds
                : userIds.map((id) => new Types.ObjectId(id)),
    },
    played_at: { $gt: start, $lt: end },
})

export const lightTrackLookupPipeline = (idField: string): PipelineStage[] => [
    {
        $lookup: {
            from: 'track',
            localField: idField,
            foreignField: 'id',
            as: 'track',
            pipeline: [
                {
                    $project: {
                        _id: 1,
                        id: 1,
                        name: 1,
                        artists: 1,
                        album: 1,
                        images: 1,
                        duration_ms: 1,
                    },
                },
            ],
        },
    },
    { $unwind: '$track' },
]

export const lightAlbumLookupPipeline = (idField: string): PipelineStage[] => [
    {
        $lookup: {
            from: 'album',
            localField: idField,
            foreignField: 'id',
            as: 'album',
            pipeline: [{ $project: { _id: 1, id: 1, name: 1, artists: 1, images: 1 } }],
        },
    },
    { $unwind: '$album' },
]

export const lightArtistsLookupPipeline = (idField: string): PipelineStage.Lookup => ({
    $lookup: {
        from: 'artist',
        localField: idField,
        foreignField: 'id',
        as: 'artists',
        pipeline: [{ $project: { _id: 1, id: 1, name: 1, images: 1, genres: 1 } }],
    },
})

export const lightArtistLookupPipeline = (idField: string): PipelineStage[] => [
    {
        $lookup: {
            from: 'artist',
            localField: idField,
            foreignField: 'id',
            as: 'artist',
            pipeline: [{ $project: { _id: 1, id: 1, name: 1, images: 1, genres: 1 } }],
        },
    },
    { $unwind: '$artist' },
]
