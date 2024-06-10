import mongoose, { Schema, Document, Model } from "mongoose";
import { ObjectId } from "mongodb";
import Conversation from "../../domain/conversation";

const ConversationSchema: Schema = new Schema<Conversation | Document>({
    members: [{ type: String }],
    lastMessage: { type: String, default: "" },
    timestamps: true,
    tradesmanId: { type: ObjectId, default: null },
});

const ConversationModel: Model<Conversation & Document> = mongoose.model<
    Conversation & Document
>("Conversation", ConversationSchema);

export default ConversationModel;
