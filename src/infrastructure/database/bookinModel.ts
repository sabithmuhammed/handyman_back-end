import mongoose, { Schema, Document, Model } from "mongoose";
import Booking from "../../domain/booking";
import { ObjectId } from "mongodb";

const BookingSchema: Schema = new Schema<Booking | Document>({
    userId: {
        type: ObjectId,
        required: true,
        ref: "User",
    },
    tradesmanId: {
        type: ObjectId,
        required: true,
        ref: "Tradesman",
    },
    bookingNumber: String,
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: "booked",
        required: true,
    },
    address: {
        house: { type: String },
        street: { type: String },
        city: { type: String },
        state: { type: String },
        country: { type: String },
        pincode: { type: String },
        location: {
            coordinates: [{ type: Number }],
            Point: { type: String, default: "Point" },
        },
    },
    bookingDate: Date,
    service:{type:String},
    slots: [{ type: String }],
    amount: Number,
    paymentDetails: {
        status: { type: String, default: "pending" },
        date: {
            type: Date,
        },
    },
});

const BookingModel: Model<Booking & Document> = mongoose.model<
    Booking & Document
>("Booking", BookingSchema);

export default BookingModel;
