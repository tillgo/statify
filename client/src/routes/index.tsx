import { createFileRoute } from '@tanstack/react-router'
import { useUserQuery } from '@/lib/api/queries/useUserQuery.ts'

export const Route = createFileRoute('/')({
    component: RouteComponent,
})

function RouteComponent() {
    const { data } = useUserQuery()

    return (
        <div>
            Hi {data!.username}, danke fürs beta testen ❤️ <br />
            <br />
            DASHBOARD - COMING SOON
        </div>
    )
}
