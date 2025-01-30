import { useQuery } from '@tanstack/react-query'
import { AxiosClient } from '@/lib/api/AxiosClient.ts'
import { Button } from '@/components/ui/button.tsx'

export const MainPage = () => {

    const { data, isLoading } = useQuery({
        queryKey: ['me'],
        queryFn: ({ signal }) => AxiosClient.get('/auth/spotify/me', { signal, withCredentials: true }).then((res) => res.data),
    })

    if (isLoading) return <div className={'p-4'}>Loading ...</div>

    if (!data) return (<div className={'flex flex-col gap-3 p-4'} >
        Bitte melde dich mit deinem Spotify account an.
        <Button
            onClick={() => {
                window.location.href = `${import.meta.env.VITE_SERVER_API_URL}/auth/spotify`
            }}
            className={'w-20'}
        >
            Login
        </Button>
    </div>)

    return (<div className={'p-4'}>
        Hi {data.display_name}, danke fürs beta testen :D Ich meld mich wenn actually was zu sehen ist hier xD
    </div>)
}