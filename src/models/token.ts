import mongoose from "mongoose";

const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const tokenSchema = new Schema({
  userId: { type: ObjectId, ref: "User", required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now, expires: 900 },
});

export default mongoose.model("Token", tokenSchema);
