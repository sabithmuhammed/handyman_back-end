import mongoose, { Schema, Document, Model } from "mongoose";
import User from "../../domain/user";

const UserSchema: Schema = new Schema<User | Document>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    profile: {
        type: String,
        default:""
    },
    password: {
        type: String,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    isTradesman: {
        type: Boolean,
        default: false,
    },
    isGoogle: {
        type: Boolean,
        default: false,
    },
});

const UserModel: Model<User & Document> = mongoose.model<User & Document>(
    "User",
    UserSchema
);

export default UserModel;
