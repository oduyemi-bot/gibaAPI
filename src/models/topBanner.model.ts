import mongoose, { Schema, Document } from "mongoose";

export interface IBannerItem extends Document {
    _id: mongoose.Types.ObjectId;
    phone: string;
    email: string;
    message: string;
}

const bannerItemSchema: Schema = new Schema<IBannerItem>({
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        unique: true,
        trim: true,
        minlength: [10, "Phone number must be at least 10 digits long"],
        match: /^\+?[1-9]\d{1,14}$/,
      },
      email: {
        type: String,
        required: [true, "Email is required"],
        validate: {
          validator: (v: string) => /^\S+@\S+\.\S+$/.test(v), 
          message: "Please provide a valid email address",
        },
      },
      message: {
        type: String,
        required: [true, "Message is required"],
        minlength: [6, "Message must be at least 6 characters long"],
        trim: true,
      },
});

const BannerItem = mongoose.model<IBannerItem>("BannerItem", bannerItemSchema);
export default BannerItem;
