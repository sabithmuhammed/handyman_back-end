import { ObjectId } from "mongoose";

export default interface Tool {
    _id?: string;
    name: string;
    rent: number;
    street: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    location: {
        coordinates: [number, number];
        type: "Point";
    };
    userId: string | ObjectId;
    images: string[];
}
