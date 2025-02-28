import { Types } from "mongoose"

export interface IUser {
  _id: Types.ObjectId
  email: string
  username: string
  isAdmin: boolean
}