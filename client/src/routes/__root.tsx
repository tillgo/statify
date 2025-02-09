import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Button } from '@/components/ui/button.tsx'
import { useUser } from '@/lib/api/queries/useUser.ts'
import { AppSidebar } from '@/components/app-sidebar.tsx'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar.tsx'
import { Separator } from '@/components/ui/separator.tsx'
import { Breadcrumbs } from '@/components/breadcrumbs.tsx'
import { Toaster } from '@/components/ui/sonner.tsx'

export const Route = createRootRoute({
    component: RootComponent,
})

function RootComponent() {
    const { data, isLoading } = useUser()

    if (isLoading) return <div className={'p-4'}>Loading ...</div>

    if (!data)
        return (
            <div className={'flex flex-col gap-3 p-4'}>
                Bitte melde dich mit deinem Spotify account an.
                <Button
                    onClick={() => {
                        window.location.href = `${import.meta.env.VITE_SERVER_API_URL}/auth/spotify`
                    }}
                    className={'w-20'}
                >
                    Login
                </Button>
            </div>
        )

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center transition-[width,height] ease-linear">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumbs />
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <Outlet />
                </div>
            </SidebarInset>
            <Toaster />
            <TanStackRouterDevtools position={'bottom-right'} />
        </SidebarProvider>
    )
}
