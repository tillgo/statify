import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosClient } from '@/lib/api/AxiosClient.ts'

export const useImportUploadMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (files: File[]) => {
            const formData = new FormData()
            files.forEach((file) => {
                formData.append('imports', file)
            })

            const res = await AxiosClient.post('import/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            return res.data
        },
        onSettled: () => {
            void queryClient.invalidateQueries({ queryKey: ['importState'] })
        },
    })
}
