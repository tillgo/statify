import { useQuery } from '@tanstack/react-query'
import { AxiosClient } from '@/lib/api/AxiosClient.ts'
import { LightUser } from '@shared/api.types.ts'

export const useUsersQuery = () =>
    useQuery<LightUser[]>({
        queryKey: ['users'],
        queryFn: ({ signal }) => AxiosClient.get('/users', { signal }).then((res) => res.data),
    })
