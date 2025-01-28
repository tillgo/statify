import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
import { LoggedRequest, SpotifyRequest } from './types'
import { getUserFromField } from '../services/user'
import { getEnv } from './env'
import { verify } from 'jsonwebtoken'
import { Types } from 'mongoose'
import { SpotifyAPI } from './apis/spotifyApi'

type Location = "body" | "params" | "query";

export const validating =
    (
        schema: z.AnyZodObject | z.ZodDiscriminatedUnion<any, any>,
        location: Location = "body",
    ) =>
        (req: Request, _: Response, next: NextFunction) => {
            try {
                req[location] = schema.parse(req[location]);
                return next();
            } catch (e) {
                next(e)
            }
        };

export const logged = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const user = await baselogged(req, false);
    if (!user) {
        res.status(401).end();
        return;
    }
    (req as LoggedRequest).user = user;
    next();
};

export const withHttpClient = async (
    req: Request,
    _: Response,
    next: NextFunction,
) => {
    const { user } = req as LoggedRequest;

    (req as SpotifyRequest & LoggedRequest).client = new SpotifyAPI(user._id.toString());
    next();
};

const baselogged = async (req: Request, useQueryToken = false) => {
    const { token: queryToken } = req.query;

    if (useQueryToken && queryToken && typeof queryToken === "string") {
        const user = await getUserFromField("publicToken", queryToken, false);
        if (user) {
            return user;
        }
    }

    const auth = req.cookies.token;
    if (!auth) {
        return null;
    }

    try {
        const jwtSecret = getEnv("JWT_SECRET");
        if (!jwtSecret) {
            return null
        }
        const jwtUser = verify(auth, jwtSecret) as {
            userId: string;
        };

        const user = await getUserFromField(
            "_id",
            new Types.ObjectId(jwtUser.userId),
            false,
        );

        if (!user) {
            return null;
        }
        return user;
    } catch (e) {
        return null;
    }
};