import { CollabTopGenre } from '@shared/api.types.ts'
import { PropsWithChildren } from 'react'
import { startCase } from 'lodash'

type Props = PropsWithChildren<{
    rank: number
    entry: CollabTopGenre
}>
export const GenreItem = ({ rank, entry, children }: Props) => {
    return (
        <div className={'flex h-10 items-center gap-2 rounded-lg p-2 hover:bg-accent md:gap-4'}>
            <span className={'text-sm md:text-base'}>{rank}</span>

            <span className={'line-clamp-2 text-sm md:text-base'}>{startCase(entry._id)}</span>

            {children}
        </div>
    )
}
