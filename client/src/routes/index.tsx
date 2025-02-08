import { createFileRoute } from '@tanstack/react-router'
import { useUser } from '@/lib/api/queries/useUser.ts'

export const Route = createFileRoute('/')({
    component: RouteComponent,
})

function RouteComponent() {
    const { data } = useUser()

    console.log('data', data)

    return <div className={'p-4'}>
        Hi {data.display_name}, danke fürs beta testen :D Ich meld mich wenn actually was zu sehen ist hier xD
    </div>
}
