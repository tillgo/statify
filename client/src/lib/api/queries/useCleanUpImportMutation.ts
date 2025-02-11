import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosClient } from '@/lib/api/AxiosClient.ts'

export const useCleanUpImportMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: string) =>
            AxiosClient.delete(`import/clean/${id}`).then((res) => res.data),
        onSettled: () => {
            void queryClient.invalidateQueries({ queryKey: ['importState'] })
        },
    })
}
