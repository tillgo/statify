import { MongoServerSelectionError } from 'mongodb'
import { SpotifyAPI } from '../../utils/apis/spotifyApi'
import { Infos, RecentlyPlayedTrack, User } from '../../shared/types'
import { retryPromise, wait } from '../../utils/misc'
import { getUserAtIndex, getUserCount } from '../userService'
import { getTracksAlbumsArtists, storeIterationOfLoop } from './dbTools'
import { logger } from '../../utils/logger'
import { AxiosError } from 'axios'
import { findDuplicateInfo } from '../infoService'

const RETRY = 3

const loop = async (user: User) => {
    logger.info(`[${user.username}]: refreshing...`)

    if (!user.accessToken) {
        logger.error(`User ${user.username} has not access token, please relog to Spotify`)
        return
    }

    const url = `/me/player/recently-played?after=${user.lastTimestamp - 1000 * 60 * 60 * 2}`
    const spotifyApi = new SpotifyAPI(user._id.toString())

    const items: RecentlyPlayedTrack[] = []
    let nextUrl = url

    do {
        const response = await retryPromise(() => spotifyApi.raw(nextUrl), RETRY, 10)
        const { data } = response
        items.push(...data.items)
        nextUrl = data.next
    } while (nextUrl)

    const lastTimestamp = Date.now()

    if (items.length === 0) {
        logger.info(`[${user.username}]: no new music`)
        return
    }

    const spotifyTracks = items.map((e) => e.track)
    const { tracks, albums, artists } = await getTracksAlbumsArtists(
        user._id.toString(),
        spotifyTracks
    )

    const infos: Omit<Infos, 'owner' | '_id'>[] = []
    for (let i = 0; i < items.length; i += 1) {
        const item = items[i]!
        const date = new Date(item.played_at)
        const duplicate = await findDuplicateInfo(user._id.toString(), item.track.id, date, 30)
        if (!duplicate) {
            const [primaryArtist] = item.track.artists
            if (!primaryArtist) {
                continue
            }
            infos.push({
                played_at: new Date(item.played_at),
                durationMs: item.track.duration_ms,
                albumId: item.track.album.id,
                primaryArtistId: primaryArtist.id,
                artistIds: item.track.artists.map((e) => e.id),
                id: item.track.id,
            })
        }
    }
    await storeIterationOfLoop(user._id.toString(), lastTimestamp, tracks, albums, artists, infos)
    logger.info(
        `[${user.username}]: ${tracks.length} tracks, ${albums.length} albums, ${artists.length} artists`
    )
}

const WAIT_MS = 120 * 1000

export const dbLoop = async () => {
    while (true) {
        try {
            const nbUsers = await getUserCount()
            logger.info(`[DbLoop] starting for ${nbUsers} users`)

            for (let i = 0; i < nbUsers; i += 1) {
                const users = await getUserAtIndex(i)

                for (const us of users) {
                    await loop(us)
                }
            }
        } catch (error) {
            logger.error(error)
            if (error instanceof MongoServerSelectionError) {
                logger.error('Exiting because mongo is unreachable')
                process.exit(1)
            }
            if (error instanceof AxiosError) {
                if (error.response?.data) {
                    logger.info('Response of failed request', error.response.data)
                }
                logger.info(
                    'There appears to be issues with either your internet connection or Spotify'
                )
            }
        }
        await wait(WAIT_MS)
    }
}
