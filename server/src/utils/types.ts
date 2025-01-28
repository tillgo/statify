import { z } from "zod";
import { Types } from "mongoose";
import { User } from '../shared/types'
import { Request } from "express";

export type ObjIdOrString = Types.ObjectId | string

export type TypedPayload<
    T extends z.AnyZodObject | z.ZodDiscriminatedUnion<any, any>,
> = z.infer<T>;

export interface LoggedRequest extends Request {
    user: User;
}

export interface SpotifyRequest extends Request {
    client: SpotifyAPI;
}