import mongoose, { Schema, Document } from "mongoose";

export interface IBannerItem extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
}

const bannerItemSchema: Schema = new Schema<IBannerItem>({
  name: {
    type: String,
    required: [true, "Item is required"],
    unique: true,
    trim: true,
    minlength: [3, "Item must be at least 3 characters long"],
  },
});

const BannerItem = mongoose.model<IBannerItem>("BannerItem", bannerItemSchema);
export default BannerItem;
