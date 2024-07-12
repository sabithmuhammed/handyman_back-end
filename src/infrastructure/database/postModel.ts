import mongoose, { Schema, Document, Model } from "mongoose";
import { ObjectId } from "mongodb";
import Post from "../../domain/post";

const PostSchema: Schema = new Schema<Post | Document>({
    text: { type: String },
    image: { type: String },
    date: { type: Date },
    tradesmanId: { type: ObjectId, ref: "Tradesman" },
    likes: [{ type: ObjectId, ref: "User" }],
});

const PostModel: Model<Post & Document> = mongoose.model<Post & Document>(
    "Post",
    PostSchema
);

export default PostModel;
