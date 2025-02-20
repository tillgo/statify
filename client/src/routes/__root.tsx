import { Outlet, createRootRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button.tsx'
import { useMyUserQuery } from '@/lib/api/queries/useMyUserQuery.ts'
import { AppSidebar } from '@/components/sidebar/app-sidebar.tsx'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar.tsx'
import { Separator } from '@/components/ui/separator.tsx'
import { Breadcrumbs } from '@/components/sidebar/breadcrumbs.tsx'
import { Toaster } from '@/components/ui/sonner.tsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx'

export const Route = createRootRoute({
    component: RootComponent,
})

function RootComponent() {
    const { data, isLoading } = useMyUserQuery()

    if (isLoading) return <div className={'p-4'}>Loading ...</div>

    if (!data) return <LoginPage />

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center transition-[width,height] ease-linear">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-2 h-8 w-8" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumbs />
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <Outlet />
                </div>
            </SidebarInset>
            <Toaster />
            {/*<TanStackRouterDevtools position={'bottom-right'} />*/}
        </SidebarProvider>
    )
}

const LoginPage = () => {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Login / Sign-up</CardTitle>
                    <CardDescription>
                        Connect your Spotify account, to start tracking your activity.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button
                        className="w-full"
                        onClick={() => {
                            window.location.href = `${import.meta.env.VITE_SERVER_API_URL}/auth/spotify`
                        }}
                    >
                        Login with Spotify
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
