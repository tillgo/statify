import { readFile, unlink } from 'fs/promises'
import { z } from 'zod'
import { SpotifyAPI } from '../../utils/apis/spotifyApi'
import { ImportState, Infos, RecentlyPlayedTrack, User } from '../../shared/types'
import { minOfArray, retryPromise } from '../../utils/misc'
import { getTracksAlbumsArtists, storeTrackAlbumArtist } from '../syncLoop/dbTools'
import { addTrackIdsToUser, getCloseTrackId, storeFirstListenedAtIfLess } from '../userService'
import { logger } from '../../utils/logger'
import { setImportStateCurrent } from './importStateService'
import { getFromCacheString, setToCacheString } from './cache'

const fullPrivacyFileSchema = z.array(
    z.object({
        ts: z.string(),
        ms_played: z.number(),
        spotify_track_uri: z.string().nullable(),
        master_metadata_track_name: z.string().nullable(),
        master_metadata_album_artist_name: z.string().nullable(),
    })
)

export type FullPrivacyItem = z.infer<typeof fullPrivacyFileSchema>[number]

export class HistoryImporter {
    private id: string

    private readonly userId: string

    private elements: FullPrivacyItem[] | null

    private currentItem: number

    private spotifyApi: SpotifyAPI

    constructor(user: User) {
        this.id = ''
        this.userId = user._id.toString()
        this.elements = null
        this.currentItem = 0
        this.spotifyApi = new SpotifyAPI(this.userId)
    }

    static idFromSpotifyURI = (uri: string) => uri.split(':')[2]

    search = async (spotifyIds: string[]) => {
        if (spotifyIds.length === 0) {
            return []
        }
        return retryPromise(() => this.spotifyApi.getTracks(spotifyIds), 10, 30)
    }

    storeItems = async (userId: string, items: RecentlyPlayedTrack[]) => {
        const { tracks, albums, artists } = await getTracksAlbumsArtists(
            userId,
            items.map((it) => it.track)
        )
        await storeTrackAlbumArtist({
            tracks,
            albums,
            artists,
        })
        const finalInfos: Omit<Infos, 'owner' | '_id'>[] = []
        for (let i = 0; i < items.length; i += 1) {
            const item = items[i]!
            const date = new Date(item.played_at)
            const duplicate = await getCloseTrackId(this.userId.toString(), item.track.id, date, 60)
            const currentImportDuplicate = finalInfos.find(
                (e) => Math.abs(e.played_at.getTime() - date.getTime()) <= 60 * 1000
            )
            if (duplicate.length > 0 || currentImportDuplicate) {
                logger.info(`${item.track.name} - ${item.track.artists[0]?.name} was duplicate`)
                continue
            }
            const [primaryArtist] = item.track.artists
            if (!primaryArtist) {
                continue
            }
            finalInfos.push({
                played_at: date,
                id: item.track.id,
                primaryArtistId: primaryArtist.id,
                albumId: item.track.album.id,
                artistIds: item.track.artists.map((e) => e.id),
                durationMs: item.track.duration_ms,
            })
        }
        await setImportStateCurrent(this.id, this.currentItem + 1)
        await addTrackIdsToUser(this.userId.toString(), finalInfos)
        const min = minOfArray(finalInfos, (info) => info.played_at.getTime())
        if (min) {
            const minInfo = finalInfos[min.minIndex]
            if (minInfo) {
                await storeFirstListenedAtIfLess(this.userId, minInfo.played_at)
            }
        }
    }

    initWithJSONContent = async (content: any[]) => {
        const value = fullPrivacyFileSchema.safeParse(content)
        if (value.success) {
            this.elements = value.data
            return content
        }
        logger.error(
            'If you submitted the right files and this error comes up, please open an issue with the following logs at https://github.com/Yooooomi/your_spotify',
            JSON.stringify(value.error.issues, null, ' ')
        )
        return null
    }

    initWithFiles = async (filePaths: string[]) => {
        const files = await Promise.all(filePaths.map((f) => readFile(f)))
        const filesContent = files.map((f) => JSON.parse(f.toString()))

        const totalContent = filesContent.reduce<FullPrivacyItem[]>((acc, curr) => {
            acc.push(...curr)
            return acc
        }, [])

        return await this.initWithJSONContent(totalContent)
    }

    init = async (existingState: ImportState | null, filePaths: string[]) => {
        try {
            this.currentItem = existingState?.current ?? 0
            const success = await this.initWithFiles(filePaths)
            if (success) {
                return { total: this.elements!.length }
            }
        } catch (e) {
            logger.error(e)
        }
        return null
    }

    checkIdsToSearch = async (
        idsToSearch: Record<string, string[]>,
        items: RecentlyPlayedTrack[],
        force = false
    ) => {
        const ids = Object.keys(idsToSearch)
        if (ids.length < 45 && !force) {
            return idsToSearch
        }
        const searchedItems = await this.search(ids)
        searchedItems.forEach((searchedItem) => {
            const playedAt = idsToSearch[searchedItem.id]
            if (!playedAt) {
                logger.error('Cannot add item', searchedItem.id, 'no played_at found')
                return
            }
            setToCacheString(this.userId.toString(), searchedItem.id, searchedItem)
            playedAt.forEach((pa) => {
                items.push({ track: searchedItem, played_at: pa })
            })
            logger.info(`Adding ${searchedItem.name} - ${searchedItem.artists[0]?.name} from data`)
        })
        idsToSearch = {}
        return idsToSearch
    }

    run = async (id: string) => {
        this.id = id
        let items: RecentlyPlayedTrack[] = []
        // Id of song to played_at
        let idsToSearch: Record<string, string[]> = {}
        if (!this.elements) {
            return false
        }
        for (let i = this.currentItem; i < this.elements.length; i += 1) {
            this.currentItem = i
            logger.info(`Importing... (${i}/${this.elements.length})`)
            const content = this.elements[i]!
            if (
                !content.spotify_track_uri ||
                !content.master_metadata_track_name ||
                !content.master_metadata_album_artist_name
            ) {
                continue
            }
            if (content.ms_played < 30 * 1000) {
                // If track was played for less than 30 seconds
                logger.info(
                    `Track ${content.master_metadata_track_name} - ${
                        content.master_metadata_album_artist_name
                    } was passed, only listened for ${Math.floor(content.ms_played / 1000)} seconds`
                )
                continue
            }
            const spotifyId = HistoryImporter.idFromSpotifyURI(content.spotify_track_uri)
            if (!spotifyId) {
                logger.warn(`Could not get spotify id from uri: ${content.spotify_track_uri}`)
                continue
            }
            const item = getFromCacheString(this.userId.toString(), spotifyId)
            if (!item) {
                const arrayOfPlayedAt = idsToSearch[spotifyId] ?? []
                arrayOfPlayedAt.push(content.ts)
                idsToSearch[spotifyId] = arrayOfPlayedAt
                idsToSearch = await this.checkIdsToSearch(idsToSearch, items)
            } else {
                items.push({ track: item, played_at: content.ts })
            }
            if (items.length >= 20) {
                await this.storeItems(this.userId, items)
                items = []
            }
        }
        await this.checkIdsToSearch(idsToSearch, items, true)
        if (items.length > 0) {
            await this.storeItems(this.userId, items)
            items = []
        }
        return true
    }

    cleanup = async (filePaths: string[]) => {
        await Promise.all(filePaths.map((f) => unlink(f)))
    }
}
