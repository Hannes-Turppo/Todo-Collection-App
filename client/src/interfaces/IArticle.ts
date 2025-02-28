import { Types } from "mongoose"

export interface IArticle {
    _id: Types.ObjectId
    parent: Types.ObjectId
    owner: Types.ObjectId
    title: string
    content: string
    color: string
    tags: string[]
}
