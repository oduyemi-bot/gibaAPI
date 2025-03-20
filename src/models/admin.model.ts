import mongoose, { Document } from "mongoose";



export interface IAdmin extends Document {
  _id: mongoose.Types.ObjectId;
  fname: string;
  lname: string;
  email: string;
  phone: string;
  jobrole: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const adminSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      required: [true, "First name is required"],
    },
    lname: {
      type: String,
      required: [true, "Last name is required"],
    },
    email: {
      type: String,
      unique: true,
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
    jobrole: {
      type: String,
      required: [true, "Job role is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      validate: {
        validator: (password: string) =>
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[^\s]).{8,}$/.test(password),
        message:
          "Password must be at least 8 characters long and contain at least one capital letter, one small letter, one digit, and one special character.",
      },
    },
  },
  { timestamps: true }
);

const Admin = mongoose.model<IAdmin>("Admin", adminSchema);
export default Admin;