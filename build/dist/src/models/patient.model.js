"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const patientSchema = new mongoose_1.default.Schema({
    fullname: {
        type: String,
        required: [true, "Full name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        validate: {
            validator: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
            message: "Invalid email format",
        },
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        validate: {
            validator: (phone) => /^\+?\d{1,3}[- ]?\d{3}[- ]?\d{3}[- ]?\d{4}$/.test(phone),
            message: "Invalid phone number format",
        },
    },
    age: {
        type: Number,
        required: [true, "Age is required"],
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"],
        required: true,
    },
    address: {
        type: String,
        required: [true, "Address is required"],
    },
    medicalHistory: {
        type: String,
        default: "No medical history provided",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const Patient = mongoose_1.default.model("Patient", patientSchema);
exports.default = Patient;
