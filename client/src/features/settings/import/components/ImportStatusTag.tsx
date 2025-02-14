import { ImportStateStatus } from '@shared/types.ts'
import { Badge, BadgeProps } from '@/components/ui/badge.tsx'

type Config = {
    label: string
    variant: BadgeProps['variant']
}
const config: Record<ImportStateStatus, Config> = {
    success: {
        label: 'SUCCESS',
        variant: 'success',
    },
    failure: {
        label: 'FAILED',
        variant: 'destructive',
    },
    progress: {
        label: 'PROGRESS',
        variant: 'secondary',
    },
    'failure-removed': {
        label: 'REMOVED',
        variant: 'default',
    },
}

export const ImportStatusTag = ({ status }: { status: ImportStateStatus }) => {
    const conf = config[status]

    return <Badge variant={conf.variant}>{conf.label}</Badge>
}
