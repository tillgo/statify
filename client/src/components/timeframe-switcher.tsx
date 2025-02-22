import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select.tsx'
import { cn } from '@/lib/utils.ts'

type Timeframe = {
    value: string
    label: string
    start: Date | null
}
// eslint-disable-next-line react-refresh/only-export-components
export const timeframes: Timeframe[] = [
    {
        value: 'last-month',
        label: 'Last Month',
        start: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    },
    {
        value: 'last-year',
        label: 'Last Year',
        start: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365),
    },
    { value: 'all-time', label: 'All Time', start: null },
    //{ value: '_custom_', label: 'Custom' },
]

type Props = {
    onChange?: (start: Date | null) => void
    hide?: boolean
    className?: string
}

export default function TimeframeSwitcher({ onChange, className, hide }: Props) {
    const [selectedTimeframe, setSelectedTimeframe] = useState(timeframes[1].value)

    const handleTimeframeChange = (value: string) => {
        setSelectedTimeframe(value)
        const timeframe = timeframes.find((timeframe) => timeframe.value === value)
        onChange?.(timeframe?.start ?? null)
    }

    if (hide) {
        return <div className={cn('w-full max-w-sm', className)} />
    }
    return (
        <div className={cn('w-full max-w-sm', className)}>
            <div className="hidden sm:block">
                <Tabs value={selectedTimeframe} onValueChange={handleTimeframeChange}>
                    <TabsList className="grid w-full grid-cols-3">
                        {timeframes.map((timeframe) => (
                            <TabsTrigger key={timeframe.value} value={timeframe.value}>
                                {timeframe.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
            </div>

            <div className="sm:hidden">
                <Select value={selectedTimeframe} onValueChange={handleTimeframeChange}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                        {timeframes.map((timeframe) => (
                            <SelectItem key={timeframe.value} value={timeframe.value}>
                                {timeframe.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
