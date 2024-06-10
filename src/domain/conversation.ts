import { ObjectId } from "mongoose";

export default interface Conversation {
    _id?: string;
    id?: string;
    members: [string, string];
    timestamps: Date;
    lastMessage: string;
    tradesmanId: ObjectId | null;
}
