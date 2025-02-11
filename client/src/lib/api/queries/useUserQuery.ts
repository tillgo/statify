import { useQuery } from '@tanstack/react-query'
import { AxiosClient } from '@/lib/api/AxiosClient.ts'
import { User } from '@shared/types.ts'

export const useUserQuery = () =>
    useQuery<User | null>({
        queryKey: ['me'],
        queryFn: ({ signal }) => AxiosClient.get('/me', { signal }).then((res) => res.data),
    })
