import mongoose, { Schema, Document, Model } from "mongoose";
import Tradesman from "../../domain/tradesman";
import { ObjectId } from "mongodb";

const TradesmanSchema: Schema = new Schema<Tradesman | Document>({
    name: {
        type: String,
        required: true,
    },
    profile: { type: String, required: true },
    idProof: { type: String, required: true },
    userId: { type: ObjectId, required: true, ref: "User" },
    experience: {
        type: Number,
        required: true,
    },
    skills: [{ type: String, trim: true }],
    location: {
        coordinates: [{ type: Number }],
        type: {
            type: String,
            default: "Point",
        },
    },
    rating: [
        {
            rating: Number,
            userId: String,
        },
    ],
    wage: {
        amount: Number,
        type: {
            type: String,
            default: "Day",
        },
    },
    verificationStatus: { type: String, default: "pending" },
    isBlocked: { type: Boolean, default: false },
});

const TradesmanModel: Model<Tradesman & Document> = mongoose.model<
    Tradesman & Document
>("Tradesman", TradesmanSchema);

export default TradesmanModel;
