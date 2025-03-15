import { useHistoryQuery } from '@/features/history/hooks/useHistoryQuery.ts'
import { useCallback, useRef } from 'react'
import { SongItem } from '@/components/song-item.tsx'
import { LoaderCircle } from 'lucide-react'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge.tsx'

export const HistoryPage = () => {
    const { data, fetchNextPage, isFetchingNextPage, hasNextPage } = useHistoryQuery()

    console.log(data)

    const observer = useRef<IntersectionObserver | null>(null)
    const lastItemRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (isFetchingNextPage) return
            if (observer.current) observer.current.disconnect()
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasNextPage) {
                    void fetchNextPage()
                }
            })
            if (node) observer.current.observe(node)
        },
        [isFetchingNextPage, fetchNextPage, hasNextPage]
    )

    return (
        <div className={'mx-auto flex w-full max-w-5xl flex-col gap-2'}>
            {data?.pages?.flatMap((page, pageIndex) =>
                page.items.map((item, index) => {
                    const isLastItem =
                        pageIndex === data.pages.length - 1 && index === page.items.length - 1

                    return (
                        <div ref={isLastItem ? lastItemRef : undefined} key={item._id}>
                            <SongItem rank={pageIndex * 50 + index + 1} entry={item}>
                                <span className={'ml-auto gap-2'}>
                                    <Badge variant={'secondary'} className={'text-xs'}>
                                        {format(new Date(item.played_at), 'dd.MM.yy HH:mm')}
                                    </Badge>
                                </span>
                            </SongItem>
                        </div>
                    )
                })
            )}

            {isFetchingNextPage && <LoaderCircle className="mx-auto animate-spin" />}
        </div>
    )
}
