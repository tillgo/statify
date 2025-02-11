import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/my-history')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>MY HISTORY - COMING SOON</div>
}
