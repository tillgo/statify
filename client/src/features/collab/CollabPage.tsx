import { UserSelect } from '@/components/user-select.tsx'
import { Dispatch, ReactNode, SetStateAction, useState } from 'react'
import { CollabTopArtist, CollabTopGenre, CollabTopSong, LightUser } from '@shared/api.types.ts'
import {
    CollabTopData,
    CollabTopType,
    useCollabTopQuery,
} from '@/features/collab/hooks/useCollabTopQuery.ts'
import { Badge } from '@/components/ui/badge.tsx'
import { useMyUserQuery } from '@/lib/api/queries/useMyUserQuery.ts'
import { LoaderCircle } from 'lucide-react'
import TimeframeSwitch, { timeframes } from '@/components/timeframe-switch.tsx'
import { SongItem } from '@/components/song-item.tsx'
import { DateRange } from 'react-day-picker'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx'
import { ArtistItem } from '@/components/artist-item.tsx'
import { GenreItem } from '@/components/gerne-item.tsx'

export const CollabPage = () => {
    const [user, setUser] = useState<LightUser | undefined>()
    const [dateRange, setDateRange] = useState<DateRange>({
        from: timeframes[1].start,
        to: undefined,
    })
    const [type, setType] = useState<CollabTopType>('songs')

    const { data: self } = useMyUserQuery()
    const { data = [], isLoading } = useCollabTopQuery(type, {
        otherIds: user ? [user._id.toString()] : [],
        ...dateRange,
    })

    return (
        <div className={'mx-auto flex w-full max-w-5xl flex-col gap-4'}>
            <div className={'flex justify-between gap-2'}>
                <UserSelect value={user} onChange={setUser} excludeSelf={true} />

                <TimeframeSwitch onChange={setDateRange} hide={!user} />
            </div>

            {user && <CollabTopTypeSwitch value={type} onChange={setType} />}

            {isLoading && <LoaderCircle className="mx-auto animate-spin" />}

            {!isLoading && user && (
                <div className={'flex flex-col gap-2'}>
                    <span className={'ml-auto flex items-center gap-2'}>
                        <Badge variant={'default'} className={'ml-auto'}>
                            Your streams
                        </Badge>
                        <Badge variant={'outline'}>{`${user.username}s streams`}</Badge>
                    </span>

                    {data.map((entry, index) => {
                        const config = collabTopTypes.find((c) => c.value === type)
                        return config!.renderer(
                            entry,
                            index,
                            <>
                                <Badge variant={'default'} className={'ml-auto'}>
                                    {entry[`amount_${self!._id.toString()}`]}x
                                </Badge>
                                <Badge variant={'outline'}>
                                    {entry[`amount_${user._id.toString()}`]}x
                                </Badge>
                            </>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

type CollabTopConfig<T extends CollabTopType> = {
    value: T
    label: string
    renderer: (entry: CollabTopData<T>, index: number, children: ReactNode) => ReactNode
}
const collabTopTypes: CollabTopConfig<CollabTopType>[] = [
    {
        value: 'songs',
        label: 'Songs',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        renderer: (entry: CollabTopSong, index, children) => (
            <SongItem key={entry._id} entry={entry} rank={index + 1}>
                {children}
            </SongItem>
        ),
    },
    {
        value: 'artists',
        label: 'Artists',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        renderer: (entry: CollabTopArtist, index, children) => (
            <ArtistItem key={entry._id} entry={entry} rank={index + 1}>
                {children}
            </ArtistItem>
        ),
    },
    {
        value: 'genres',
        label: 'Genres',
        renderer: (entry: CollabTopGenre, index, children) => (
            <GenreItem key={entry._id} entry={entry} rank={index + 1}>
                {children}
            </GenreItem>
        ),
    },
]

type DataTypeSwitchProps = {
    value: CollabTopType
    onChange: Dispatch<SetStateAction<CollabTopType>>
}
const CollabTopTypeSwitch = ({ value, onChange }: DataTypeSwitchProps) => (
    <Tabs value={value} onValueChange={onChange as never}>
        <TabsList className="grid max-w-xs grid-cols-3">
            {collabTopTypes.map((type) => (
                <TabsTrigger key={type.value} value={type.value} className={'gap-1'}>
                    {type.label}
                </TabsTrigger>
            ))}
        </TabsList>
    </Tabs>
)
