import { ObjectId } from "mongoose";

export default interface Tradesman {
    id?: string;
    _id?: string;
    name: string;
    profile: string;
    idProof: string;
    userId: string | ObjectId;
    experience: number;
    category: string;
    location: {
        coordinates: [number, number];
        type: "Point";
    };
    configuration?: {
        startingTime: string;
        endingTime: string;
        slotSize: number;
        bufferTime: number;
        workingDays: boolean[];
        services: {
            description: string;
            amount: number;
            slots: number;
        }[];
    };
    verificationStatus?: "pending" | "rejected" | "verified";
    isBlocked?: boolean;
}
