import { ObjectId } from "mongoose";

export default interface Message {
    _id?: string;
    id?: string;
    conversationId: ObjectId;
    senderId: ObjectId;
    message: {
        type: ["audio", "image", "text"];
        content: string;
    };
}
