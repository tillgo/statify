import { InfosModel } from '../db/models'

export const findDuplicateInfo = async (
    userId: string,
    trackId: string,
    date: Date,
    secondsPlusMinus: number
) => {
    const startDate = new Date(date.getTime())
    const endDate = new Date(date.getTime())
    startDate.setSeconds(startDate.getSeconds() - secondsPlusMinus)
    endDate.setSeconds(endDate.getSeconds() + secondsPlusMinus)

    return InfosModel.findOne({
        owner: userId,
        id: trackId,
        played_at: { $gt: startDate, $lt: endDate },
    })
        .lean()
        .exec()
}
