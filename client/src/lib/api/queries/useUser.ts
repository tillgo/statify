import { useQuery } from '@tanstack/react-query'
import { AxiosClient } from '@/lib/api/AxiosClient.ts'

export const useUser = () => useQuery({
    queryKey: ['me'],
    queryFn: ({ signal }) => AxiosClient.get('/auth/spotify/me', { signal }).then((res) => res.data),
})