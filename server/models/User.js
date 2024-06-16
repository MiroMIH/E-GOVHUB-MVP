import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    firstName: {
      type: String,
      required: true,
      min: 2,
      max: 100,
    },
    lastName: {
      type: String,
      required: true,
      min: 2,
      max: 100,
    },
    role: {
      type: String,
      enum: ["admin", "citizen", "superadmin"],
      default: "admin",
    },
    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    commune: {
      type: String, // Add commune field of type String
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
