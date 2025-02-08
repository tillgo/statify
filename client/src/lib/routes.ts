import { type NavItem } from '@/components/nav-main.tsx'
import { Home, Settings } from 'lucide-react'

export const routes: Record<string, NavItem[]> = {
    General: [
        {
            title: 'Home',
            url: '/',
            icon: Home,
        },
    ],
    Settings: [
        {
            title: 'Settings',
            url: '/settings',
            icon: Settings,
        },
    ],
}
