import mongoose, { Schema, Document, Model } from "mongoose";
import { ObjectId } from "mongodb";
import Post from "../../domain/post";

const PostSchema: Schema = new Schema<Post | Document>({
    text: { type: String },
    image: { type: String },
    date: { type: Date },
    tradesmanId:{type:ObjectId,ref:"Tradesman"},
    likes: [{ userId: { type: ObjectId, ref: "User" } }],
    comments: [
        { userId: { type: ObjectId, ref: "User" }, comment: { type: String } },
    ],
});

const PostModel: Model<Post & Document> = mongoose.model<Post & Document>(
    "Post",
    PostSchema
);

export default PostModel;
