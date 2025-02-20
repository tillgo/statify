import { Album, Artist, Track, User } from './types'

type LightTrack = Pick<Track, '_id' | 'id' | 'name' | 'artists' | 'album' | 'duration_ms'>

type LightAlbum = Pick<Album, '_id' | 'id' | 'name' | 'artists' | 'images'>

type LightArtist = Pick<Artist, '_id' | 'id' | 'name' | 'images' | 'genres'>

export type CollabTopSong = {
    _id: string
    track: LightTrack
    album: LightAlbum
    artists: LightArtist[]
    min_ratio: number
    avg_ratio: number
    combined_score: number
} & Record<`amount_${string}`, number> &
    Record<`total_${string}`, number>

export type LightUser = Pick<User, '_id' | 'username'>
