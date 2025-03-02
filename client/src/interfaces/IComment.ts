import { ObjectId } from "mongoose";

export interface IComment {
  id: ObjectId
  content: string
  createdAt: Date
}