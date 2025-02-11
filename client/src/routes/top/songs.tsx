import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/top/songs')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>YOUR TOP SONGS - COMING SOON</div>
}
