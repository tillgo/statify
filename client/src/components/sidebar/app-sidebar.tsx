import * as React from 'react'
import { NavMain } from '@/components/sidebar/nav-main.tsx'
import { NavUser } from '@/components/sidebar/nav-user.tsx'
import { SiteLogo } from '@/components/sidebar/site-logo.tsx'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from '@/components/ui/sidebar.tsx'
import { routes } from '@/lib/routes.ts'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SiteLogo />
            </SidebarHeader>
            <SidebarContent>
                <NavMain routes={routes} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
