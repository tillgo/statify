import { useQuery } from '@tanstack/react-query'
import { AxiosClient } from '@/lib/api/AxiosClient.ts'

export const useCollabTopSongsQuery = (params: { otherIds: string[]; start: Date }) =>
    useQuery({
        queryKey: ['collab/top/songs'],
        queryFn: ({ signal }) =>
            AxiosClient.get('/collab/top/songs', { signal, params }).then((res) => res.data),
    })
