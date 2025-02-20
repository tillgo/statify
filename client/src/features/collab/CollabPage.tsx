import { UserSelect } from '@/components/user-select.tsx'
import { useState } from 'react'
import { LightUser } from '@shared/api.types.ts'
import { useCollabTopSongsQuery } from '@/features/collab/hooks/useCollabTopSongsQuery.ts'
import { IdealImage } from '@/components/ideal-image.tsx'
import { Badge } from '@/components/ui/badge.tsx'
import { useMyUserQuery } from '@/lib/api/queries/useMyUserQuery.ts'

export const CollabPage = () => {
    const [user, setUser] = useState<LightUser | undefined>()

    const { data: self } = useMyUserQuery()
    const { data = [] } = useCollabTopSongsQuery({
        otherIds: user ? [user._id.toString()] : [],
        start: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365),
    })

    console.log(data)

    return (
        <div className={'mx-auto flex w-full max-w-5xl flex-col gap-6'}>
            <div className={'flex gap-2'}>
                <UserSelect value={user} onChange={setUser} excludeSelf={true} />

                {user && (
                    <span className={'ml-auto flex items-center gap-2'}>
                        <Badge variant={'default'} className={'ml-auto'}>
                            Your streams
                        </Badge>
                        <Badge variant={'outline'}>{`${user.username}s streams`}</Badge>
                    </span>
                )}
            </div>

            <div className={'flex flex-col gap-2'}>
                {user &&
                    data.map((entry, index) => (
                        <div
                            key={entry._id}
                            className={
                                'flex items-center gap-2 rounded-lg p-2 hover:bg-accent md:gap-4'
                            }
                        >
                            <span>{index + 1}</span>
                            <IdealImage images={entry.album.images} size={48} />

                            <div className={'flex flex-col'}>
                                <span className={'overflow-auto text-sm md:text-base'}>
                                    {entry.track.name}
                                </span>
                                <span className={'text-xs'}>
                                    {entry.artists.map((artist) => artist.name).join(', ')}
                                </span>
                            </div>

                            <Badge variant={'default'} className={'ml-auto'}>
                                {entry[`amount_${self!._id.toString()}`]}x
                            </Badge>
                            <Badge variant={'outline'}>
                                {entry[`amount_${user._id.toString()}`]}x
                            </Badge>
                        </div>
                    ))}
            </div>
        </div>
    )
}
