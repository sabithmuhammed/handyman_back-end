import mongoose, { Schema, Document, Model } from "mongoose";
import Comment from "../../domain/comment";
import { ObjectId } from "mongodb";

const CommentSchema: Schema = new Schema<Comment | Document>({
    postId: {
        type: ObjectId,
        ref: "Post",
        required: true,
    },
    userId: {
        type: ObjectId,
        ref: "User",
        required: true,
    },
    comment: {
        type: String,
    },
    softDelete: {
        type: Boolean,
        default: false,
    },
    replies: [
        {
            userId: { type: ObjectId, required: true },
            comment: {
                type: String,
            },
            createdAt: {
                type: Date,
                default: new Date(),
            },
        },
    ],
    createdAt: {
        type: Date,
        default: new Date(),
    },
});

const CommentModel: Model<Comment & Document> = mongoose.model<
    Comment & Document
>("Comment", CommentSchema);

export default CommentModel;
