import mongoose, { Schema, Document } from "mongoose";

export interface IContact extends Document {
  _id: mongoose.Types.ObjectId;
  fullname: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  createdAt: Date;
}

const contactSchema: Schema = new mongoose.Schema({
  fullname: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
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
  subject: {
    type: String,
    required: [true, "Subject is required"],
  },
  message: {
    type: String,
    required: [true, "Message is required"],
  },

  status: {
    type: String,
    enum: ["pending", "working", "resolved", "rejected"],
    required: true,
    default: "pending",
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Contact = mongoose.model<IContact>("Contact", contactSchema);
export default Contact;