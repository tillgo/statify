import { useState } from 'react'
import { FileUploader } from '@/components/file-uploader.tsx'
import { Button } from '@/components/ui/button.tsx'
import { useImportUploadMutation } from '@/lib/api/queries/useImportUploadMutation.ts'
import { useImportStateQuery } from '@/lib/api/queries/useImportStateQuery.ts'
import { isEmpty } from 'lodash'
import { ImportStateDisplay } from '@/features/import/ImportStateDisplay.tsx'

const validate = (file: File) => file.name.startsWith('Streaming_History_Audio')

export const Import = () => {
    const [files, setFiles] = useState<File[]>([])

    const { data: importStates } = useImportStateQuery()
    const { mutate: upload, isPending } = useImportUploadMutation()

    const handleUpload = () => {
        upload(files)
        setFiles([])
    }

    const hasImports = !isEmpty(importStates)
    const isImporting = importStates?.some((state) => state.status === 'progress') ?? false

    return (
        <div className={'flex flex-col gap-4'}>
            {hasImports && <ImportStateDisplay />}

            {!isEmpty(files) && !isImporting && (
                <Button onClick={handleUpload}>Upload Files</Button>
            )}

            {!isPending && !isImporting && (
                <FileUploader
                    className="h-40"
                    value={files}
                    onValueChange={setFiles}
                    accept={{ 'application/json': ['.json'] }}
                    multiple={true}
                    maxFileCount={50}
                    maxSize={1024 * 1024 * 20}
                    validate={validate}
                    validateMessage={'Files must start with prefix "Streaming_History_Audio"'}
                />
            )}
        </div>
    )
}
