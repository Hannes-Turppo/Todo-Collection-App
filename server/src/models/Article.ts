import mongoose, {Document, Schema} from "mongoose"

interface IArticle extends Document {
    owner: string
    parent: string
    color: string
    header: string
    content: string
    tags: string[]
}

const articleSchema = new Schema ({
    owner: {type: String, required: true},
    parent: {type: String, required: true},
    color: {type: String, required: true},
    header: {type: String, required: true},
    content: {type: String, required: true},
    tags: {type: [String], required: true},
})

const Article: mongoose.Model<IArticle> = mongoose.model<IArticle>("Article", articleSchema)

export { Article, IArticle }
