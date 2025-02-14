import { ChevronsUpDown, LogOut, Settings } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx'
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar.tsx'
import { useUserQuery } from '@/lib/api/queries/useUserQuery.ts'
import { useSpotifyUserQuery } from '@/lib/api/queries/useSpotifyUserQuery.ts'
import { User } from '@shared/types.ts'
import { Link } from '@tanstack/react-router'
import { useLogoutMutation } from '@/lib/api/queries/useLogoutMutation.ts'

export function NavUser() {
    const { isMobile } = useSidebar()

    const { data: user } = useUserQuery()
    const { data: spotifyUser } = useSpotifyUserQuery()
    const { mutate: logout } = useLogoutMutation()

    const fallbackAvatar = user!.username
        .split(' ')
        .map((part) => part.charAt(0).toUpperCase())
        .join('')

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <AvatarWithName
                                user={user!}
                                fallbackAvatar={fallbackAvatar}
                                email={spotifyUser?.email}
                            />
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? 'bottom' : 'right'}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <AvatarWithName
                                    user={user!}
                                    fallbackAvatar={fallbackAvatar}
                                    email={spotifyUser?.email}
                                />
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem className="cursor-pointer" asChild>
                                <Link to={'/settings'}>
                                    <Settings />
                                    Settings
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer" onClick={() => logout()}>
                            <LogOut />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}

const AvatarWithName = ({
    user,
    fallbackAvatar,
    email,
}: {
    user: User
    fallbackAvatar: string
    email: string
}) => (
    <>
        <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={''} alt={user.username} />
            <AvatarFallback className="rounded-lg">{fallbackAvatar}</AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{user.username}</span>
            <span className="truncate text-xs">{email}</span>
        </div>
    </>
)
