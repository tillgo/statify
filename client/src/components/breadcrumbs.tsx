import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
} from '@/components/ui/breadcrumb.tsx'
import { Link, useMatches } from '@tanstack/react-router'
import { routes } from '@/lib/routes.ts'

export const Breadcrumbs = () => {
    const matches = useMatches()

    const route = matches.filter((match) => match.id !== '__root__')[0]
    const routeDef = Object.values(routes)
        .flat(1)
        .find((def) => def.url === route?.routeId)

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {routeDef && (
                    <BreadcrumbItem>
                        <BreadcrumbLink className={'flex items-center gap-2'} asChild>
                            <Link to={route.routeId as never}>
                                <routeDef.icon size={16} />
                                {routeDef.title}
                            </Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                )}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
