import mongoose, {Document, Schema, Types} from "mongoose"

interface IArticle extends Document {
    id: string
    parent: Types.ObjectId
    owner: Types.ObjectId
    color: string
    title: string
    content: string
    tags: string[]
}

const articleSchema = new Schema ({
    id: {type: String, unique:false, default:""},
    owner: {type: Schema.Types.ObjectId, ref: "User", required: true},
    parent: {type: Schema.Types.ObjectId, ref: "Collection", required: true},
    color: {type: String, required: true},
    title: {type: String, required: true},
    content: {type: String, required: true},
    tags: {type: [String], required: true},
})

const Article: mongoose.Model<IArticle> = mongoose.model<IArticle>("Article", articleSchema)

export { Article, IArticle }
