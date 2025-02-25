import mongoose, { Document, Schema } from "mongoose"
import { IArticle } from "./Article"

interface ICollection extends Document {
    owner: string
    name: string
}

const collectionSchema = new Schema({
    owner: { type: String, required: true },
    name: { type: String, required: true }
})

const Collection: mongoose.Model<ICollection> = mongoose.model<ICollection>("Collection", collectionSchema)

export { Collection, ICollection }
