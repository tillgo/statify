import { getEnv } from '../../utils/env'
import { SpotifyTrack } from '../../shared/types'

const getMaxCacheSize = () => getEnv('MAX_IMPORT_CACHE_SIZE', 100000)

const cache: Record<string, Record<string, SpotifyTrack>> = {}

function getKey(track: string, artist: string) {
    return `${track}-${artist}`
}

export function getFromCacheString(userId: string, str: string) {
    if (!(userId in cache)) {
        cache[userId] = {}
    }
    return cache[userId]?.[str]
}

export function getFromCache(
    userId: string,
    track: string,
    artist: string
): SpotifyTrack | undefined {
    const key = getKey(track, artist)
    return getFromCacheString(userId, key)
}

export function setToCacheString(userId: string, str: string, trackObject: SpotifyTrack) {
    const userCache = cache[userId] ?? {}
    const keys = Object.keys(cache[userId] ?? {})
    const [firstKey] = keys
    if (keys.length > getMaxCacheSize() && firstKey) {
        delete cache[userId]?.[firstKey]
    }
    userCache[str] = trackObject
    cache[userId] = userCache
}

export function setToCache(
    userId: string,
    track: string,
    artist: string,
    trackObject: SpotifyTrack
) {
    const key = getKey(track, artist)
    setToCacheString(userId, key, trackObject)
}

export function clearCache(userId: string) {
    cache[userId] = {}
}
