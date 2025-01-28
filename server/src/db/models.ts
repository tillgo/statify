import { model } from "mongoose";
import { UserSchema } from './schemas/user'

export const UserModel = model("User", UserSchema, 'user');