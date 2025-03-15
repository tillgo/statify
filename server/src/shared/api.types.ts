import { Album, Artist, Track, User } from './types'

type LightTrack = Pick<Track, '_id' | 'id' | 'name' | 'artists' | 'album' | 'duration_ms'>

type LightAlbum = Pick<Album, '_id' | 'id' | 'name' | 'artists' | 'images'>

type LightArtist = Pick<Artist, '_id' | 'id' | 'name' | 'images' | 'genres'>

export type CollabTopSong = {
    _id: string
    track: LightTrack
    album: LightAlbum
    artists: LightArtist[]
    score: number
} & Record<`amount_${string}`, number>

export type CollabTopArtist = {
    _id: string
    artist: LightArtist
    score: number
} & Record<`amount_${string}`, number>

export type CollabTopGenre = {
    _id: string // genre name
    score: number
} & Record<`amount_${string}`, number>

export type TopSong = {
    _id: string
    track: LightTrack
    album: LightAlbum
    artists: LightArtist[]
    amount: number
}

export type TopArtist = {
    _id: string
    artist: LightArtist
    amount: number
}

export type TopGenre = {
    _id: string // genre name
    amount: number
}

export type LightUser = Pick<User, '_id' | 'username'>
