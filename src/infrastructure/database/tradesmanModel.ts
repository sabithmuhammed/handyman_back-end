import mongoose, { Schema, Document, Model, Mixed } from "mongoose";
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
    category: { type: String, trim: true },
    location: {
        coordinates: {
            type: [Number],
            required: true,
        },
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ["Point"], // 'location.type' must be 'Point'
            required: true,
        },
    },
    reviews: [{ review: String, rating: Number, userId: String }],
    configuration: {
        startingTime: { type: String, default: "09:00" },
        endingTime: { type: String, default: "17:00" },
        workingDays: {
            type: [Boolean],
            default: [false, true, true, true, true, true, true],
        },
        slotSize: { type: Number, default: 1 },
        bufferTime: { type: Number, default: 15 },
        services: [
            {
                description: { type: String },
                amount: { type: Number },
                slots: { type: Number },
            },
        ],
    },
    verificationStatus: { type: String, default: "pending" },
    isBlocked: { type: Boolean, default: false },
});

TradesmanSchema.index({ location: "2dsphere" });

const TradesmanModel: Model<Tradesman & Document> = mongoose.model<
    Tradesman & Document
>("Tradesman", TradesmanSchema);

export default TradesmanModel;
