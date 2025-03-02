import { ObjectId, Types } from "mongoose";
import { IArticle } from "./IArticle";

export interface ICollection {
  _id: Types.ObjectId
  owner: Types.ObjectId
  title: string
  color: string
  articles: IArticle[]
}
