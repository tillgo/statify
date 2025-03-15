import { createFileRoute } from '@tanstack/react-router'
import { TopPage } from '@/features/top/TopPage.tsx'

export const Route = createFileRoute('/top/genres')({
    component: RouteComponent,
})

function RouteComponent() {
    return <TopPage type={'genres'} />
}
