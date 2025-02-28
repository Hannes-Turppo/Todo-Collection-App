import mongoose, {Document, Schema, Types} from "mongoose"

interface IArticle extends Document {
    parent: Types.ObjectId
    owner: string
    color: string
    title: string
    content: string
    tags: string[]
}

const articleSchema = new Schema ({
    owner: {type: String, required: true},
    parent: {type: String, required: true},
    color: {type: String, required: true},
    title: {type: String, required: true},
    content: {type: String, required: true},
    tags: {type: [String], required: true},
})

const Article: mongoose.Model<IArticle> = mongoose.model<IArticle>("Article", articleSchema)

export { Article, IArticle }
