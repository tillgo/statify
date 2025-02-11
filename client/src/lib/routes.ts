import { type NavItem } from '@/components/nav-main.tsx'
import { History, Home, Music2, Settings, User } from 'lucide-react'

export const routes: Record<string, NavItem[]> = {
    General: [
        {
            title: 'Home',
            url: '/',
            icon: Home,
        },
        {
            title: 'My History',
            url: '/my-history',
            icon: History,
        },
    ],
    Tops: [
        {
            title: 'Top songs',
            url: '/top/songs',
            icon: Music2,
        },
        {
            title: 'Top artists',
            url: '/top/artists',
            icon: User,
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
