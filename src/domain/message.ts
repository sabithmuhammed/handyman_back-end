import { ObjectId } from "mongoose";

export default interface Message {
    _id?: string;
    id?: string;
    conversationId: ObjectId;
    senderId: ObjectId;
    receiverId: ObjectId;
    message: {
        type: "audio" | "image" | "text";
        content: string;
    };
    status: "sent" | "recieved" | "seen";
    createdAt?: Date;
    updatedAt?: Date;
}
