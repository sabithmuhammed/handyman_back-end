"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const mongodb_1 = require("mongodb");
const TradesmanSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    profile: { type: String, required: true },
    idProof: { type: String, required: true },
    userId: { type: mongodb_1.ObjectId, required: true, ref: "User" },
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
    rating: [
        {
            rating: Number,
            userId: String,
        },
    ],
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
const TradesmanModel = mongoose_1.default.model("Tradesman", TradesmanSchema);
exports.default = TradesmanModel;
//# sourceMappingURL=tradesmanModel.js.map