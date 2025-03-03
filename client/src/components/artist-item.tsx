import { IdealImage } from '@/components/ideal-image.tsx'
import { CollabTopArtist } from '@shared/api.types.ts'
import { PropsWithChildren } from 'react'

type Props = PropsWithChildren<{
    rank: number
    entry: Pick<CollabTopArtist, '_id' | 'artist'>
}>
export const ArtistItem = ({ rank, entry, children }: Props) => {
    return (
        <div className={'flex h-16 items-center gap-2 rounded-lg p-2 hover:bg-accent md:gap-4'}>
            <span className={'text-sm md:text-base'}>{rank}</span>
            <IdealImage images={entry.artist.images} size={48} />

            <span className={'line-clamp-2 text-sm md:text-base'}>{entry.artist.name}</span>

            {children}
        </div>
    )
}
