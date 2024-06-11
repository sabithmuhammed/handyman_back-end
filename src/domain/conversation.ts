import { ObjectId } from "mongoose";

export default interface Conversation {
    _id?: string;
    id?: string;
    members: [string, string];
    lastMessage: string;
    tradesmanId?: ObjectId | null;
    createdAt?: Date;
    updatedAt?: Date;
}
