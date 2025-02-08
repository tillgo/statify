import { ObjIdOrString } from '../utils/types'
import { Types } from 'mongoose'

export type DarkModeType = 'system' | 'dark' | 'light'

export type User = {
    _id: ObjIdOrString
    username: string
    admin: boolean
    spotifyId: string | null
    expiresIn: number
    accessToken: string | null
    refreshToken: string | null
    lastTimestamp: number
    tracks: ObjIdOrString[]
    settings: {
        darkMode: DarkModeType
    }
    lastImport: string | null
    publicToken: string | null
    firstListenedAt?: Date
}

export type SpotifyImage = {
    url: string
    height: number
    width: number
}

export type Artist = {
    external_urls: any
    followers: any
    genres: string[]
    href: string
    id: string
    images: SpotifyImage[]
    name: string
    popularity: number
    type: string
    uri: string
}
export type SpotifyArtist = Artist

export type Album = {
    album_type: string
    artists: string[]
    available_markets: string[]
    copyrights: any[]
    external_ids: any
    external_urls: any
    genres: string[]
    href: string
    id: string
    images: SpotifyImage[]
    name: string
    popularity: number
    release_date: string
    release_date_precision: string
    type: string
    uri: string
}
export type SpotifyAlbum = Omit<Album, 'artists'> & {
    artists: Artist[]
    tracks: Track[]
}

export type Track = {
    album: string
    artists: string[]
    available_markets: string[]
    disc_number: number
    duration_ms: number
    explicit: boolean
    external_ids: any
    external_urls: any
    href: string
    id: string
    is_local: boolean
    name: string
    popularity: number
    preview_url: string
    track_number: number
    type: string
    uri: string
}
export type SpotifyTrack = Omit<Track, 'artists' | 'album'> & {
    artists: Artist[]
    album: Album
}
export type RecentlyPlayedTrack = {
    played_at: string
    track: SpotifyTrack
}

export type Infos = {
    owner: Types.ObjectId
    id: string
    albumId: string
    primaryArtistId: string
    artistIds: string[]
    durationMs: number
    played_at: Date
}
