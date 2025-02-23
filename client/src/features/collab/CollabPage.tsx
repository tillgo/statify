import { UserSelect } from '@/components/user-select.tsx'
import { useState } from 'react'
import { LightUser } from '@shared/api.types.ts'
import { useCollabTopSongsQuery } from '@/features/collab/hooks/useCollabTopSongsQuery.ts'
import { Badge } from '@/components/ui/badge.tsx'
import { useMyUserQuery } from '@/lib/api/queries/useMyUserQuery.ts'
import { LoaderCircle } from 'lucide-react'
import TimeframeSwitch, { timeframes } from '@/components/timeframe-switch.tsx'
import { SongItem } from '@/components/song-item.tsx'
import { DateRange } from 'react-day-picker'

export const CollabPage = () => {
    const [user, setUser] = useState<LightUser | undefined>()
    const [dateRange, setDateRange] = useState<DateRange>({
        from: timeframes[1].start,
        to: undefined,
    })

    const { data: self } = useMyUserQuery()
    const { data = [], isLoading } = useCollabTopSongsQuery({
        otherIds: user ? [user._id.toString()] : [],
        ...dateRange,
    })

    return (
        <div className={'mx-auto flex w-full max-w-5xl flex-col gap-6'}>
            <div className={'flex justify-between gap-2'}>
                <UserSelect value={user} onChange={setUser} excludeSelf={true} />

                <TimeframeSwitch onChange={setDateRange} hide={!user} />
            </div>

            {isLoading && <LoaderCircle className="mx-auto animate-spin" />}

            {!isLoading && user && (
                <div className={'flex flex-col gap-2'}>
                    <span className={'ml-auto flex items-center gap-2'}>
                        <Badge variant={'default'} className={'ml-auto'}>
                            Your streams
                        </Badge>
                        <Badge variant={'outline'}>{`${user.username}s streams`}</Badge>
                    </span>

                    {data.map((entry, index) => (
                        <SongItem key={entry._id} entry={entry} rank={index + 1}>
                            <Badge variant={'default'} className={'ml-auto'}>
                                {entry[`amount_${self!._id.toString()}`]}x
                            </Badge>
                            <Badge variant={'outline'}>
                                {entry[`amount_${user._id.toString()}`]}x
                            </Badge>
                        </SongItem>
                    ))}
                </div>
            )}
        </div>
    )
}
