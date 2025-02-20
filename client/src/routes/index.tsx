import { createFileRoute } from '@tanstack/react-router'
import { useMyUserQuery } from '@/lib/api/queries/useMyUserQuery.ts'

export const Route = createFileRoute('/')({
    component: RouteComponent,
})

function RouteComponent() {
    const { data } = useMyUserQuery()

    return (
        <div>
            Hi {data!.username}, danke fürs beta testen ❤️ <br />
            <br />
            DASHBOARD - COMING SOON
        </div>
    )
}
