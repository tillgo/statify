import { ReactNode, useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select.tsx'
import { cn } from '@/lib/utils.ts'
import { usePrevious } from '@uidotdev/usehooks'
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover.tsx'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'
import { Calendar } from '@/components/ui/calendar'
import { DateRange } from 'react-day-picker'
import { addDays, endOfDay, startOfDay } from 'date-fns'
import { de } from 'date-fns/locale'
import { debounce } from 'lodash'
import { useWindowSize } from '@uidotdev/usehooks'

type Timeframe = {
    value: string
    label: string
    start: Date | undefined
    icon?: ReactNode
}

const customValue = '_custom_'
// eslint-disable-next-line react-refresh/only-export-components
export const timeframes: Timeframe[] = [
    {
        value: 'last-month',
        label: 'Last Month',
        start: addDays(startOfDay(new Date()), -30),
    },
    {
        value: 'last-year',
        label: 'Last Year',
        start: addDays(startOfDay(new Date()), -365),
    },
    { value: 'all-time', label: 'All Time', start: undefined },
]

type Props = {
    onChange?: (range: DateRange) => void
    hide?: boolean
    className?: string
}

export default function TimeframeSwitch({ onChange, className, hide }: Props) {
    const [selectedTimeframe, setSelectedTimeframe] = useState(timeframes[1].value)
    const previousTimeframe = usePrevious(selectedTimeframe)
    const [isCustom, setIsCustom] = useState(false)

    const [pickerOpen, setPickerOpen] = useState(false)
    const [customDate, setCustomDate] = useState<DateRange | undefined>({
        from: addDays(startOfDay(new Date()), -30),
        to: startOfDay(new Date()),
    })

    const size = useWindowSize()

    const handleTimeframeChange = (value: string) => {
        setSelectedTimeframe(value)
        if (value === customValue) return

        const timeframe = timeframes.find((timeframe) => timeframe.value === value)
        setIsCustom(false)
        onChange?.({ from: timeframe?.start, to: undefined })
    }

    const handleOpenChange = (open: boolean) => {
        setPickerOpen(open)
        if (!open && !isCustom) {
            setSelectedTimeframe(previousTimeframe)
        }
    }

    const handleSelectCustomRange = () => {
        if (!customDate) return
        setIsCustom(true)
        setPickerOpen(false)
        onChange?.({
            from: startOfDay(customDate.from!),
            to: customDate.to ? endOfDay(customDate.to) : endOfDay(customDate.from!),
        })
    }

    if (hide) {
        return <div className={cn('w-full max-w-sm', className)} />
    }
    return (
        <Popover open={pickerOpen} onOpenChange={handleOpenChange}>
            <PopoverAnchor>
                <div className={cn('w-full max-w-sm', className)}>
                    <div className="hidden sm:block">
                        <Tabs value={selectedTimeframe} onValueChange={handleTimeframeChange}>
                            <TabsList className="grid w-full grid-cols-4">
                                {timeframes.map((timeframe) => (
                                    <TabsTrigger
                                        key={timeframe.value}
                                        value={timeframe.value}
                                        className={'gap-1'}
                                    >
                                        {timeframe.label}
                                    </TabsTrigger>
                                ))}
                                <TabsTrigger
                                    key={customValue}
                                    value={customValue}
                                    className={'gap-1'}
                                    onClick={() => setPickerOpen(true)}
                                >
                                    <CalendarIcon size={16} />
                                    {'Custom'}
                                </TabsTrigger>
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
                                <SelectItem
                                    key={customValue}
                                    value={customValue}
                                    onClick={debounce(() => setPickerOpen(true), 50)}
                                >
                                    <span className={'flex items-center gap-1'}>
                                        <CalendarIcon size={16} />
                                        {'Custom'}
                                    </span>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </PopoverAnchor>

            <PopoverContent className="flex w-auto flex-col gap-2 p-2" align="end">
                <Calendar
                    locale={de}
                    mode="range"
                    initialFocus
                    defaultMonth={customDate?.from}
                    selected={customDate}
                    onSelect={setCustomDate}
                    numberOfMonths={size.width! >= 640 ? 2 : 1}
                    classNames={{ day_today: 'border border-primary' }}
                />
                <Button className={'w-full'} onClick={handleSelectCustomRange}>
                    Select
                </Button>
            </PopoverContent>
        </Popover>
    )
}
