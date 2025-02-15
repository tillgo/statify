import { useQuery } from '@tanstack/react-query'
import { AxiosClient } from '@/lib/api/AxiosClient.ts'
import { CollabTopSong } from '@shared/api.types.ts'

export const useCollabTopSongsQuery = (params: { otherIds: string[]; start: Date }) =>
    useQuery<CollabTopSong[]>({
        queryKey: ['collab/top/songs'],
        queryFn: ({ signal }) =>
            AxiosClient.get('/collab/top/songs', { signal, params }).then((res) => res.data),
    })
