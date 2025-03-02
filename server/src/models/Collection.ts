import mongoose, { Document, Schema, Types } from "mongoose"
import { IArticle } from "./Article"

interface ICollection extends Document {
    owner: Types.ObjectId
    title: string
    color: string
    articles: Types.ObjectId[]
}

const CollectionSchema = new Schema({
    owner: {type: Schema.Types.ObjectId, ref: "User", require: true, unique: false},
    title: { type: String, require: true, unique: false },
    color: {type: String, require: true, default:"whiteSmoke"},
    articles: [{ type: Schema.Types.ObjectId, ref: "Article", required: true, default: [] }]
})

const Collection: mongoose.Model<ICollection> = mongoose.model<ICollection>("Collection", CollectionSchema)

export { Collection, ICollection }
