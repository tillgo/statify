import { useQuery } from '@tanstack/react-query'
import { AxiosClient } from '@/lib/api/AxiosClient.ts'
import { ImportState } from '@shared/types.ts'

export const useImportStateQuery = () =>
    useQuery<ImportState[]>({
        queryKey: ['importState'],
        queryFn: ({ signal }) =>
            AxiosClient.get('/import/state', { signal }).then((res) => res.data),
        refetchInterval: 1000 * 10,
    })
