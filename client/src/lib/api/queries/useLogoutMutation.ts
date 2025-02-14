import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosClient } from '@/lib/api/AxiosClient.ts'

export const useLogoutMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async () => AxiosClient.post(`/logout`).then((res) => res.data),
        onSettled: () => {
            void queryClient.invalidateQueries({ queryKey: ['me'] })
            queryClient.setQueryData(['me'], null)
        },
    })
}
