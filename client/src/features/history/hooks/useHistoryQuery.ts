import { useInfiniteQuery } from '@tanstack/react-query'
import { HistoryResponse } from '@shared/api.types.ts'
import { AxiosClient } from '@/lib/api/AxiosClient.ts'

export const useHistoryQuery = () =>
    useInfiniteQuery({
        queryKey: ['history'],
        queryFn: ({ signal, pageParam }) =>
            AxiosClient.get<HistoryResponse>(`/history`, {
                signal,
                params: { before: pageParam },
            }).then((res) => res.data),
        initialPageParam: new Date().toISOString(),
        getNextPageParam: (lastPage) => lastPage.next as string,
    })
