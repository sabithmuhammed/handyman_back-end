import mongoose, { Schema, Document, Model } from "mongoose";
import Admin from "../../domain/admin";

const AdminSchema: Schema = new Schema<Admin | Document>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required:true
    },
});

const AdminModel: Model<Admin & Document> = mongoose.model<Admin & Document>(
    "Admin",
    AdminSchema
);

export default AdminModel;
