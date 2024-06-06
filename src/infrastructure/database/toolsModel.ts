import mongoose, { Schema, Document, Model } from "mongoose";
import { ObjectId } from "mongodb";
import Tool from "../../domain/tool";

const ToolSchema: Schema = new Schema<Tool | Document>({
    name: { type: String, required: true },
    rent: { type: Number, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pincode: { type: String, required: true },
    location: {
        coordinates: [{ type: Number }],
        type: {
            type: String,
            default: "Point",
        },
    },
    userId: { type: ObjectId, required: true, ref: "User" },
    images: [{ type: String }],
});

const ToolModel: Model<Tool & Document> = mongoose.model<Tool & Document>(
    "Tool",
    ToolSchema
);

export default ToolModel;
