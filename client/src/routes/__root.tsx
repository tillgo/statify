import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Button } from '@/components/ui/button.tsx'
import { useUser } from '@/lib/api/queries/useUser.ts'

export const Route = createRootRoute({
    component: RootComponent,
})

function RootComponent() {
    const { data, isLoading } = useUser()

    if (isLoading) return <div className={'p-4'}>Loading ...</div>

    if (!data) return (<div className={'flex flex-col gap-3 p-4'} >
        Bitte melde dich mit deinem Spotify account an.
        <Button
            onClick={() => {
                window.location.href = `${import.meta.env.VITE_SERVER_API_URL}/auth/spotify`
            }}
            className={'w-20'}
        >
            Login
        </Button>
    </div>)

    return (
        <>
            <Outlet />
            <TanStackRouterDevtools />
        </>
    )
}
