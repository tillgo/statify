import { useQuery } from '@tanstack/react-query'
import { AxiosClient } from '@/lib/api/AxiosClient.ts'

export const useSpotifyUser = () =>
    useQuery({
        queryKey: ['spotifyMe'],
        queryFn: ({ signal }) =>
            AxiosClient.get('/auth/spotify/me', { signal }).then((res) => res.data),
    })
