import { type LucideIcon } from 'lucide-react'
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar'
import { AnyRouter, Link, RegisteredRouter, RouteIds, useMatch } from '@tanstack/react-router'

export type NavItem<TRouter extends AnyRouter = RegisteredRouter> = {
    title: string
    url: Exclude<RouteIds<TRouter['routeTree']>, '__root__'>
    icon: LucideIcon
}

export function NavMain({ routes }: { routes: Record<string, NavItem[]> }) {
    return Object.entries(routes).map(([title, items]) => (
        <SidebarGroup key={title}>
            <SidebarGroupLabel>{title}</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <Item key={item.url} item={item} />
                ))}
            </SidebarMenu>
        </SidebarGroup>
    ))
}

const Item = ({ item }: { item: NavItem }) => {
    const match = useMatch({ from: item.url, shouldThrow: false })
    const { state, setOpenMobile, isMobile } = useSidebar()

    return (
        <SidebarMenuItem key={item.url}>
            <SidebarMenuButton
                tooltip={item.title}
                asChild
                className={match ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}
                onClick={() => isMobile && setOpenMobile(false)}
            >
                <Link to={item.url}>
                    <item.icon />
                    {state === 'expanded' && <span>{item.title}</span>}
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    )
}
