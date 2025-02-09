import { useState } from 'react'
import { FileUploader } from '@/components/file-uploader.tsx'

const validate = (file: File) => file.name.startsWith('Streaming_History_Audio')

export const Import = () => {
    const [files, setFiles] = useState<File[]>([])

    return (
        <div>
            <FileUploader
                className="h-36"
                value={files}
                onValueChange={setFiles}
                accept={{ 'application/json': ['.json'] }}
                multiple={true}
                maxFileCount={10}
                maxSize={1024 * 1024 * 20}
                validate={validate}
                validateMessage={'Files must start with prefix "Streaming_History_Audio"'}
            />
        </div>
    )
}
