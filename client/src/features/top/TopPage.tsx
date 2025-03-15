import { TopType, useTopQuery } from '@/features/top/hooks/useTopQuery.ts'
import { LoaderCircle } from 'lucide-react'
import TimeframeSwitch, { timeframes } from '@/components/timeframe-switch.tsx'
import { useState } from 'react'
import { DateRange } from 'react-day-picker'
import { Badge } from '@/components/ui/badge.tsx'
import { SongItem } from '@/components/song-item.tsx'
import { ArtistItem } from '@/components/artist-item.tsx'
import { GenreItem } from '@/components/gerne-item.tsx'
import { TopArtist, TopGenre, TopSong } from '@shared/api.types.ts'

type Props<TType extends TopType> = {
    type: TType
}
export const TopPage = <TType extends TopType>({ type }: Props<TType>) => {
    const [dateRange, setDateRange] = useState<DateRange>({
        from: timeframes[1].start,
        to: undefined,
    })

    const { data = [], isLoading } = useTopQuery<TType>(type, {
        ...dateRange,
    })

    return (
        <div className={'mx-auto flex w-full max-w-5xl flex-col gap-4'}>
            <TimeframeSwitch onChange={setDateRange} className={'ml-auto'} />

            {isLoading && <LoaderCircle className="mx-auto animate-spin" />}

            {!isLoading && (
                <div className={'flex flex-col gap-2'}>
                    {data.map((entry, index) => {
                        if (type === 'songs') {
                            return (
                                <SongItem key={entry._id} rank={index + 1} entry={entry as TopSong}>
                                    <Badge className={'ml-auto'}>{entry.amount}x</Badge>
                                </SongItem>
                            )
                        }
                        if (type === 'artists') {
                            return (
                                <ArtistItem
                                    key={entry._id}
                                    rank={index + 1}
                                    entry={entry as TopArtist}
                                >
                                    <Badge className={'ml-auto'}>{entry.amount}x</Badge>
                                </ArtistItem>
                            )
                        }
                        if (type === 'genres') {
                            return (
                                <GenreItem
                                    key={entry._id}
                                    rank={index + 1}
                                    entry={entry as TopGenre}
                                >
                                    <Badge className={'ml-auto'}>{entry.amount}x</Badge>
                                </GenreItem>
                            )
                        }
                    })}
                </div>
            )}
        </div>
    )
}
