import { createFileRoute } from '@tanstack/react-router'
import { useCollabTopSongs } from '@/lib/api/queries/useCollabTopSongs.ts'

export const Route = createFileRoute('/my-history')({
    component: RouteComponent,
})

function RouteComponent() {
    const { data } = useCollabTopSongs({
        otherIds: ['679c7dac338efb03ec6c9323'],
        start: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365),
    })

    console.log(data)

    return <div>MY HISTORY - COMING SOON</div>
}
