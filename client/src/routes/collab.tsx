import { createFileRoute } from '@tanstack/react-router'
import { CollabPage } from '@/features/collab/CollabPage.tsx'

export const Route = createFileRoute('/collab')({
    component: CollabPage,
})
