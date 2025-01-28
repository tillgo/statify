import { User } from '../shared/types'
import { UserModel } from '../db/models'

export const getUserFromField = async <F extends keyof User>(
    field: F,
    value: User[F],
    includeTokens: boolean,
    crash = true,
) => {
    const user = UserModel.findOne(
        { [field]: value },
        includeTokens ? "-tracks" : "-tracks -accessToken -refreshToken",
    );

    if (!user && crash) {
        throw new Error('User not found')
    }
    return user;
};

export const createUser = (
    username: string,
    spotifyId: string
) =>
    UserModel.create({
        username,
        spotifyId,

        // Set last timestamp to yesterday so that we already have a pull of tracks
        lastTimestamp: Date.now() - 1000 * 60 * 60 * 24,
    });

export const storeInUser = <F extends keyof User>(
    field: F,
    value: User[F],
    infos: Partial<User>,
) => UserModel.findOneAndUpdate({ [field]: value }, infos, { new: true });