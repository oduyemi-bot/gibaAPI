import mongoose, { Schema, Document } from "mongoose";

export interface IMailingList extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  phone: string;
}

const mailingListSchema: Schema = new Schema<IMailingList>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      validate: {
        validator: (v: string) => /^\S+@\S+\.\S+$/.test(v), 
        message: "Please provide a valid email address",
      },
    },
  }
);

const MailingList = mongoose.model<IMailingList>("MailingList", mailingListSchema);
export default MailingList;
