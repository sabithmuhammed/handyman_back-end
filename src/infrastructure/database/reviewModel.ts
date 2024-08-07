import mongoose, { Schema, Document, Model } from "mongoose";
import { ObjectId } from "mongodb";
import Review from "../../domain/review";

const ReviewSchema: Schema = new Schema<Review | Document>(
    {
        review: { type: String, trim: true },
        rating: { type: Number },
        tradesmanId: { type: ObjectId, ref: "Tradesman" },
        bookingId: { type: ObjectId, ref: "Booking" },
        userId: { type: ObjectId, ref: "User" },
    },
    { timestamps: true }
);

const ReviewModel: Model<Review & Document> = mongoose.model<Review & Document>(
    "Review",
    ReviewSchema
);

export default ReviewModel;
