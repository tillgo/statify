import { TopArtist, TopGenre, TopSong } from '@shared/api.types.ts'
import { DateRange } from 'react-day-picker'
import { useQuery } from '@tanstack/react-query'
import { AxiosClient } from '@/lib/api/AxiosClient.ts'

export type TopType = 'songs' | 'artists' | 'genres'
export type TopData<T extends TopType> = T extends 'songs'
    ? TopSong
    : T extends 'artists'
      ? TopArtist
      : TopGenre

export const useTopQuery = <T extends TopType>(type: T, params: DateRange) =>
    useQuery<TopData<T>[]>({
        queryKey: [`top/${type}`, params.from?.toString(), params.to?.toString()],
        queryFn: ({ signal }) =>
            AxiosClient.get(`/top/${type}`, { signal, params }).then((res) => res.data),
    })
