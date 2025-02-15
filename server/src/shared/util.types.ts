import { Types } from 'mongoose'

export const timesplits = ['all', 'hour', 'day', 'week', 'month', 'year'] as const
export type Timesplit = (typeof timesplits)[number]

export type ObjIdOrString = Types.ObjectId | string
