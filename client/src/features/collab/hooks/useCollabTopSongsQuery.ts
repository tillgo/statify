import { useQuery } from '@tanstack/react-query'
import { AxiosClient } from '@/lib/api/AxiosClient.ts'
import { CollabTopSong } from '@shared/api.types.ts'
import { isEmpty } from 'lodash'
import { DateRange } from 'react-day-picker'

export const useCollabTopSongsQuery = (params: { otherIds: string[] } & DateRange) =>
    useQuery<CollabTopSong[]>({
        queryKey: [
            'collab/top/songs',
            params.otherIds,
            params.from?.toString(),
            params.to?.toString(),
        ],
        queryFn: ({ signal }) =>
            AxiosClient.get('/collab/top/songs', { signal, params }).then((res) => res.data),
        enabled: !isEmpty(params.otherIds),
    })
