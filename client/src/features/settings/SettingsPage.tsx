import { Import } from '@/features/settings/import/Import.tsx'
import { SunMoon } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle.tsx'
import { PropsWithChildren } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx'

export const SettingsPage = () => {
    return (
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
            <SettingsCard
                title={'Import Full History'}
                description={
                    'Upload your Spotify Extended Streaming History for the complete experience'
                }
            >
                <Import />
            </SettingsCard>

            <SettingsCard title={'Appearance'}>
                <div className="flex items-center space-x-4 rounded-md border p-4">
                    <SunMoon />
                    <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">Theme</p>
                        <p className="text-sm text-muted-foreground">
                            Switch between light and dark mode.
                        </p>
                    </div>
                    <ThemeToggle />
                </div>
            </SettingsCard>
        </div>
    )
}

const SettingsCard = ({
    title,
    description,
    children,
}: PropsWithChildren<{ title: string; description?: string }>) => (
    <Card>
        <CardHeader>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent className="flex flex-col gap-4">{children}</CardContent>
    </Card>
)
