import mongoose, { Schema, Document, Model } from "mongoose";
import { ObjectId } from "mongodb";
import Invoice from "../../domain/invoice";

const InvoiceSchema: Schema = new Schema<Invoice | Document>(
    {
        particulars: [
            {
                description: String,
                amount: Number,
                quantity: Number,
            },
        ],
        total: Number,
        status: { type: String, default: "pending" },
        bookingId: {
            type: ObjectId,
            ref: "Booking",
        },
        invoiceNumber: String,
    },
    { timestamps: true }
);

const InvoiceModel: Model<Invoice & Document> = mongoose.model<
    Invoice & Document
>("Invoice", InvoiceSchema);

export default InvoiceModel;
