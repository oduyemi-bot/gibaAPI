import mongoose, { Schema, Document } from "mongoose";

export interface IMembership extends Document {
    _id: mongoose.Types.ObjectId;
    fullname: string;
    email: string;
    phone: string;
}

const membershipSchema: Schema = new Schema<IMembership>(
  {
    fullname: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      validate: {
        validator: (v: string) => /^\S+@\S+\.\S+$/.test(v), 
        message: "Please provide a valid email address",
      },
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      validate: {
        validator: (phone: string) =>
          /^\+?\d{1,3}[- ]?\d{3}[- ]?\d{3}[- ]?\d{4}$/.test(phone),
        message: "Invalid phone number format",
      },
    },
  }
);

const Membership = mongoose.model<IMembership>("Membership", membershipSchema);
export default Membership;
