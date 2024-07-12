import { ObjectId } from "mongoose";

export default interface Invoice {
    _id?: string;
    id?: string;
    particulars: {
        description: "string";
        amount: number;
        quantity: number;
    }[];
    total: number;
    status: "pending" | "paid";
    bookingId: string | ObjectId;
    invoiceNumber:string
    createdAt?: Date;
    updatedAt?: Date;
}
