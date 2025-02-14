import { useImportStateQuery } from '@/features/settings/import/hooks/useImportStateQuery.ts'
import { ImportState } from '@shared/types.ts'
import { Progress } from '@/components/ui/progress.tsx'
import { format } from 'date-fns'
import { ImportStatusTag } from '@/features/settings/import/components/ImportStatusTag.tsx'
import { Button } from '@/components/ui/button.tsx'
import { useCleanUpImportMutation } from '@/features/settings/import/hooks/useCleanUpImportMutation.ts'

export const ImportStateDisplay = () => {
    const { data: importStates } = useImportStateQuery()

    return (
        <div className={'flex flex-col gap-4'}>
            {importStates?.map((state) => <ImportCard key={state._id.toString()} state={state} />)}
        </div>
    )
}

const ImportCard = ({ state }: { state: ImportState }) => {
    const { mutate: cleanup } = useCleanUpImportMutation()

    const handleCleanUp = () => {
        cleanup(state._id.toString())
    }

    const progress = (state.current / state.total) * 100
    return (
        <div className={'flex items-center gap-4 rounded-md border p-4'}>
            <div className={'flex flex-1 flex-col gap-2'}>
                <div className={'flex gap-4'}>
                    <span
                        className={'font-semibold'}
                    >{`Import from ${formatDate(state.createdAt)}`}</span>
                    <ImportStatusTag status={state.status} />

                    <span className={'ml-auto'}>{`${state.current} / ${state.total}`}</span>
                </div>

                {state.status === 'progress' ? <Progress value={progress} /> : null}
            </div>

            {state.status === 'failure' && (
                <Button variant={'secondary'} onClick={handleCleanUp}>
                    Clean up
                </Button>
            )}
        </div>
    )
}

const formatDate = (date: Date | string) => {
    return format(new Date(date), 'dd.MM.yy')
}
