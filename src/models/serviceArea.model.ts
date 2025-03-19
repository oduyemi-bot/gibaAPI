import mongoose, { Schema, Document } from "mongoose";

export interface IArea extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
}

const areaSchema: Schema = new Schema<IArea>({
  name: {
    type: String,
    required: [true, "Service area is required"],
    unique: true,
    trim: true,
    minlength: [3, "Name must be at least 3 characters long"],
  },
});

const Area = mongoose.model<IArea>("Area", areaSchema);
export default Area;
