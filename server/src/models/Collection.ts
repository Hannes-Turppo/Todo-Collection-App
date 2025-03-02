import mongoose, { Document, Schema, Types } from "mongoose"

interface ICollection extends Document {
    owner: Types.ObjectId
    title: string
    color: string
}

const Boardchema = new Schema({
    owner: {type: Schema.Types.ObjectId, ref: "User", require: true, unique: false},
    title: { type: String, require: true, unique: false },
    color: {type: String, require: true, default:"whiteSmoke"}
})

const Collection: mongoose.Model<ICollection> = mongoose.model<ICollection>("Collection", Boardchema)

export { Collection, ICollection }
