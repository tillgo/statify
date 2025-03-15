import { InfosModel } from '../db/models'
import {
    basicMatchUser,
    lightAlbumLookupPipeline,
    lightArtistsLookupPipeline,
    lightTrackLookupPipeline,
} from '../db/pipelineHelpers'
import { HistoryItem } from '../shared/api.types'

export const getSongHistoryItems = (
    userId: string,
    before: Date,
    limit: number
): Promise<HistoryItem[]> => {
    return InfosModel.aggregate([
        {
            $match: basicMatchUser(userId, new Date(0), before),
        },
        {
            $sort: {
                played_at: -1,
            },
        },
        { $limit: limit },
        ...lightTrackLookupPipeline('id'),
        ...lightAlbumLookupPipeline('track.album'),
        lightArtistsLookupPipeline('track.artists'),
    ]).exec()
}
