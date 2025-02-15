import { z } from 'zod'
import { User } from '../shared/types'
import { Request } from 'express'
import { SpotifyAPI } from './apis/spotifyApi'

export type TypedPayload<T extends z.AnyZodObject | z.ZodDiscriminatedUnion<any, any>> = z.infer<T>

export interface LoggedRequest extends Request {
    user: User
}

export interface SpotifyRequest extends Request {
    client: SpotifyAPI
}
