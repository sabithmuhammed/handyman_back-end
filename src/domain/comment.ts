import { ObjectId } from "mongoose";

export default interface Comment {
    _id?: string;
    postId: string | ObjectId;
    userId: string | ObjectId;
    comment: string;
    softDelete: boolean;
    replies: { userId: string | ObjectId; comment: string; createdAt: Date }[];
    createdAt:Date
}
 