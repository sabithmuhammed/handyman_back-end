import { ObjectId } from "mongoose";

export default interface Review {
    _id?: string;
    id?: string;
    review: string;
    rating: number;
    tradesmanId: string | ObjectId;
    bookingId: string | ObjectId;
    userId:string| ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}
