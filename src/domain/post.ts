import { ObjectId } from "mongoose";

export default interface Post {
    _id?: string;
    id?: string;
    text?: string;
    image?: string;
    date: Date;
    tradesmanId: ObjectId;
    likes?: object[];
    comments?: object[];
}
