
import mongoose from "mongoose";

const EmailSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      required: true,
      max: 100,
    },
    subject: {
      type: String,
      required: true,
      max: 200,
    },
    date: {
      type: Date,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["changePassword", "changeLocation"],
      required: true,
    },
  },
  { timestamps: true }
);

const Email = mongoose.model("Email", EmailSchema);
export default Email;
