import { ObjectId } from "mongoose";

export default interface Booking {
    _id?: string;
    id?: string;
    userId: string | ObjectId;
    bookingNumber: string;
    tradesmanId: string | ObjectId;
    description: string;
    bookingDate: Date;
    slots: string[];
    service: string;
    status: "booked" | "canceled" | "completed";
    address: {
        house: string;
        street: string;
        city: string;
        state: string;
        country: string;
        pincode: string;
        location: {
            coordinates: [number, number];
            type: string;
        };
    };
    amount: number;
    paymentDetails:{
        status:"pending" | "success",
        date:Date | null
    }
    createdAt?: Date;
    updatedAt?: Date;
}
