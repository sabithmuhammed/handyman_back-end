import mongoose, { Schema, Document, Model, Mixed } from "mongoose";
import Tradesman from "../../domain/tradesman";
import { ObjectId } from "mongodb";

const workingDaySchema: Schema = new Schema({
    start: {
        type: String,
        default: "09:00",
        required: true,
    },
    end: {
        type: String,
        default: "17:00",
        required: true,
    },
    isWorking: {
        type: Boolean,
        default: false,
        required: true,
    },
});

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
    configuration: {
        workingDays: {
            type: [workingDaySchema],
            default: [
                { isWorking: false, start: "09:00", end: "17:00" },
                { isWorking: true, start: "09:00", end: "17:00" },
                { isWorking: true, start: "09:00", end: "17:00" },
                { isWorking: true, start: "09:00", end: "17:00" },
                { isWorking: true, start: "09:00", end: "17:00" },
                { isWorking: true, start: "09:00", end: "17:00" },
                { isWorking: true, start: "09:00", end: "17:00" },
            ],
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
        leaves: [
            {
                date: { type: Date },
                reason: {
                    type: String,
                },
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
