import mongoose, { Schema, Document, Model } from "mongoose";
import { ObjectId } from "mongodb";
import Message from "../../domain/message";

const MessageSchema: Schema = new Schema<Message | Document>(
    {
        conversationId: { type: ObjectId },
        senderId: { type: ObjectId },
        receiverId: { type: ObjectId },
        message: {
            type: { type: String },
            content: { type: String, trim:true },
        },
        status: { type: String, default: "sent" },
    },
    { timestamps: true }
);

const MessageModel: Model<Message & Document> = mongoose.model<
    Message & Document
>("Message", MessageSchema);

export default MessageModel;
