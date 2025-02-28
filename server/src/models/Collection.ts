import mongoose, { Document, Schema } from "mongoose"
import { IArticle } from "./Article"

interface ICollection extends Document {
    owner: string
    title: string
    children: mongoose.Types.ObjectId[]
}

const Boardchema = new Schema({
    owner: { type: String, required: true },
    title: { type: String, required: true },
    children: [{ type: Schema.Types.ObjectId, ref: "Article", required: true, default: [] }]
})

const Collection: mongoose.Model<ICollection> = mongoose.model<ICollection>("Collection", Boardchema)

export { Collection, ICollection }
