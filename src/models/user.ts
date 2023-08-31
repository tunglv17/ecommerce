import mongoose from "mongoose";

const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: false },
    address: { type: String, required: false },
    role: { type: String, required: true },
    avatar: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Users", userSchema);
