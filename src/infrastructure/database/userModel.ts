import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IUsers extends Document {
    _id: ObjectId;
    name: String;
    email: String;
    password: String;
    isBlocked: Boolean;
    isTradesman: Boolean;
}

const UserSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    isTradesman: {
        type: Boolean,
        default: false,
    },
});

const UserModel = mongoose.model<IUsers>("User", UserSchema);

export default UserModel;
