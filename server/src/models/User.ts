import mongoose, {Document, Schema } from "mongoose"

interface IUser extends Document {
    email: string
    username: string
    password: string
    isAdmin: boolean
};

const userSchema = new Schema ({
    email: {type: String, required: true, unique: true},
    username: {type: String, required: true},
    password: {type: String, required: true},
    isAdmin: {type: Boolean, required: false},
});

const User: mongoose.Model<IUser> = mongoose.model<IUser>("user", userSchema);

export {User, IUser};
