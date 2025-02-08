import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ThemeProvider } from '@/components/theme-provider.tsx'
import { routeTree } from './routeTree.gen'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const router = createRouter({ routeTree })
const queryClient = new QueryClient()

// Register the router instance for type safety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
    const root = createRoot(rootElement)
    root.render(
        <StrictMode>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider>
                    <RouterProvider router={router} />
                </ThemeProvider>
            </QueryClientProvider>
        </StrictMode>,
    )
}
