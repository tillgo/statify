import { IdealImage } from '@/components/ideal-image.tsx'
import { CollabTopSong } from '@shared/api.types.ts'
import { PropsWithChildren, ReactNode } from 'react'

type Props = PropsWithChildren<{
    rank: ReactNode
    entry: Pick<CollabTopSong, '_id' | 'track' | 'artists' | 'album'>
}>
export const SongItem = ({ rank, entry, children }: Props) => {
    return (
        <div className={'flex h-16 items-center gap-2 rounded-lg p-2 hover:bg-accent md:gap-4'}>
            <span className={'text-sm md:text-base'}>{rank}</span>
            <IdealImage images={entry.album.images} size={48} />

            <div className={'flex flex-col'}>
                <span className={'line-clamp-2 text-sm md:text-base'}>{entry.track.name}</span>
                <span className={'line-clamp-1 text-xs'}>
                    {entry.artists.map((artist) => artist.name).join(', ')}
                </span>
            </div>

            {children}
        </div>
    )
}
