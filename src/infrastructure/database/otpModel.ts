import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IOtp extends Document {
    _id: ObjectId;
    email: String;
    otp:String
}

const OtpSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
});

const OtpModel = mongoose.model<IOtp>("Otp", OtpSchema);

export default OtpModel;