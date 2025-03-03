import { useQuery } from '@tanstack/react-query'
import { AxiosClient } from '@/lib/api/AxiosClient.ts'
import { CollabTopArtist, CollabTopGenre, CollabTopSong } from '@shared/api.types.ts'
import { isEmpty } from 'lodash'
import { DateRange } from 'react-day-picker'

export type CollabTopType = 'songs' | 'artists' | 'genres'
export type CollabTopData<T extends CollabTopType> = T extends 'songs'
    ? CollabTopSong
    : T extends 'artists'
      ? CollabTopArtist
      : CollabTopGenre

export const useCollabTopQuery = <T extends CollabTopType>(
    type: T,
    params: { otherIds: string[] } & DateRange
) =>
    useQuery<CollabTopData<T>[]>({
        queryKey: [
            `collab/top/${type}`,
            params.otherIds,
            params.from?.toString(),
            params.to?.toString(),
        ],
        queryFn: ({ signal }) =>
            AxiosClient.get(`/collab/top/${type}`, { signal, params }).then((res) => res.data),
        enabled: !isEmpty(params.otherIds),
    })
