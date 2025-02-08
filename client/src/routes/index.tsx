import { createFileRoute } from '@tanstack/react-router'
import { useUser } from '@/lib/api/queries/useUser.ts'

export const Route = createFileRoute('/')({
    component: RouteComponent,
})

function RouteComponent() {
    const { data } = useUser()

    return (
        <div>
            Hi {data!.username}, danke fürs beta testen :D Ich meld mich wenn actually was zu sehen
            ist hier xD
        </div>
    )
}
