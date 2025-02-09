import { AudioWaveform } from 'lucide-react'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { useNavigate } from '@tanstack/react-router'

export function SiteLogo() {
    const navigate = useNavigate()

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-accent-primary data-[state=open]:text-sidebar-accent-foreground"
                    onClick={() => navigate({ to: '/' })}
                >
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                        <AudioWaveform className="size-4" />
                    </div>
                    <span className="grid flex-1 truncate text-left text-lg font-semibold leading-tight">
                        Statify
                    </span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
