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
    configuration?: Configuration;
    verificationStatus?: "pending" | "rejected" | "verified";
    isBlocked?: boolean;
}

export interface WorkingDay {
    start: string;
    end: string;
    isWorking: boolean;
}

export interface Service {
    description: string;
    amount: number;
    slots: number;
}

export interface Configuration {
    workingDays: WorkingDay[];
    slotSize: number;
    bufferTime: number;
    services: Service[];
    leaves: { date: string | Date; reason: string }[];
}
