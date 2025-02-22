import { Infos, User } from '../shared/types'
import { InfosModel, UserModel } from '../db/models'
import { Types } from 'mongoose'

export const getUserFromField = async <F extends keyof User>(
    field: F,
    value: User[F],
    includeTokens: boolean,
    crash = false
) => {
    const user = await UserModel.findOne(
        { [field]: value },
        includeTokens ? '-tracks' : '-tracks -accessToken -refreshToken'
    )
        .lean()
        .exec()

    if (!user && crash) {
        throw new Error('User not found')
    }
    return user
}

export const createUser = (username: string, spotifyId: string) =>
    UserModel.create({
        username,
        spotifyId,

        // Set last timestamp to yesterday so that we already have a pull of tracks
        lastTimestamp: Date.now() - 1000 * 60 * 60 * 24,
    })

export const storeInUser = <F extends keyof User>(field: F, value: User[F], infos: Partial<User>) =>
    UserModel.findOneAndUpdate({ [field]: value }, infos, { new: true })
        .lean()
        .exec()

export const getUserCount = () => UserModel.countDocuments().exec()

export const getUserAtIndex = (nb: number) =>
    UserModel.find().sort({ _id: 'asc' }).skip(nb).limit(1).lean().exec()

export const getAllUsers = () =>
    UserModel.find({}, '_id username').sort({ username: 1 }).lean().exec()

export const addTrackIdsToUser = async (id: string, infos: Omit<Infos, 'owner' | '_id'>[]) => {
    const realInfos = infos.map((info) => ({
        ...info,
        owner: new Types.ObjectId(id),
    }))
    const infosSaved = await InfosModel.create(realInfos)
    return UserModel.findByIdAndUpdate(id, {
        $push: { tracks: { $each: infosSaved.map((e) => e._id) } },
    })
}

export const storeFirstListenedAtIfLess = async (userId: string, playedAt: Date) => {
    const id = new Types.ObjectId(userId)
    const user = await getUserFromField('_id', id, false)
    if (user && (!user.firstListenedAt || playedAt.getTime() < user.firstListenedAt.getTime())) {
        await storeInUser('_id', id, {
            firstListenedAt: playedAt,
        })
    }
}
