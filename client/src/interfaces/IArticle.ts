import { Types } from "mongoose"
import { IComment } from "./IComment"

export interface IArticle {
    _id: Types.ObjectId
    parent: Types.ObjectId
    owner: Types.ObjectId
    title: string
    content: string
    color: string
    due: string
    editedAt: Date
    usedTime: string
    comments: IComment[]
}
