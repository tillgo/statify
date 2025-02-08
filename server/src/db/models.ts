import { model } from 'mongoose'
import { UserSchema } from './schemas/user'
import { InfosSchema } from './schemas/infos'
import { ArtistSchema } from './schemas/artist'
import { AlbumSchema } from './schemas/album'
import { TrackSchema } from './schemas/track'
import { ImportStateSchema } from './schemas/importState'

export const UserModel = model('User', UserSchema, 'user')
export const InfosModel = model('Infos', InfosSchema, 'infos')
export const ArtistModel = model('Artist', ArtistSchema, 'artist')
export const AlbumModel = model('Album', AlbumSchema, 'album')
export const TrackModel = model('Track', TrackSchema, 'track')
export const ImportStateModel = model('ImportState', ImportStateSchema, 'importState')
