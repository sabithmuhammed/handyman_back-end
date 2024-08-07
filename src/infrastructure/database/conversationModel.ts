import mongoose, { Schema, Document, Model } from "mongoose";
import { ObjectId } from "mongodb";
import Conversation from "../../domain/conversation";

const ConversationSchema: Schema = new Schema<Conversation | Document>(
    {
        members: [{ type: ObjectId }],
        lastMessage: { type: String, default: "" },
        unreadMessage: {
            user: { type: String, default: null },
            count: {
                type: Number,
                default: 0,
            },
        },
        tradesmanId: { type: ObjectId, default: null },
    },
    { timestamps: true }
);

const ConversationModel: Model<Conversation & Document> = mongoose.model<
    Conversation & Document
>("Conversation", ConversationSchema);

export default ConversationModel;
