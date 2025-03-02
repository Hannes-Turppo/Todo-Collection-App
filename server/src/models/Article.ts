import mongoose, {Document, Schema, Types} from "mongoose"
import { ObjectId } from "mongoose";

// restructured by claude to store IComment correctly

// Define the interface for comments
interface IComment {
  id: ObjectId;
  content: string;
  createdAt: Date;
}

// Define the interface for articles
interface IArticle extends Document {
    id: string;
    parent: Types.ObjectId;
    owner: Types.ObjectId;
    title: string;
    content: string;
    color: string;
    due: string;
    editedAt: Date;
    usedTime: string;
    comments: IComment[];
}

// Define the comment schema 
const commentSchema = new Schema({
    id: { type: Schema.Types.ObjectId, default: () => new Types.ObjectId() },
    content: { type: String, require: true },
    createdAt: { type: Date, require: true },
});

// Define the article schema for Mongoose
const articleSchema = new Schema({
    id: { type: String, unique: false, default: "" },
    owner: { type: Schema.Types.ObjectId, ref: "User", require: true },
    parent: { type: Schema.Types.ObjectId, ref: "Collection", require: true },
    title: { type: String, require: true },
    content: { type: String, require: true },
    color: { type: String, require: true },
    due: { type: String, require: true, default: "" },
    editedAt: { type: Date, require: true, default: new Date() },
    usedTime: { type: String, require: true, default: "" },
    comments: [commentSchema],
});

const Article: mongoose.Model<IArticle> = mongoose.model<IArticle>("Article", articleSchema);

export { Article, IArticle, IComment };
