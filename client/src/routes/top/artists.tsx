import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/top/artists')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/top/artists"!</div>
}
