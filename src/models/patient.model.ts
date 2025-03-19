import mongoose, { Schema, Document } from "mongoose";

export interface IPatient extends Document {
  fullname: string;
  email: string;
  phone: string;
  age: number;
  gender: "male" | "female" | "other";
  address: string;
  medicalHistory: string;
  createdAt: Date;
}

const patientSchema: Schema = new mongoose.Schema({
  fullname: {
    type: String,
    required: [true, "Full name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: {
      validator: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      message: "Invalid email format",
    },
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    validate: {
      validator: (phone: string) => /^\+?\d{1,3}[- ]?\d{3}[- ]?\d{3}[- ]?\d{4}$/.test(phone),
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

const Patient = mongoose.model<IPatient>("Patient", patientSchema);
export default Patient;
