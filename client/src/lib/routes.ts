import { type NavItem } from '@/components/sidebar/nav-main.tsx'
import { History, Home, Music2, Settings, User, HeartHandshake, Guitar } from 'lucide-react'

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
        {
            title: 'With friends',
            url: '/collab',
            icon: HeartHandshake,
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
        {
            title: 'Top genres',
            url: '/top/genres',
            icon: Guitar,
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
