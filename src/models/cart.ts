import mongoose from "mongoose";

const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const cartsSchema = new Schema(
  {
    userId: { type: ObjectId, ref: "Users", required: true },
    productId: { type: ObjectId, ref: "Products", required: true },
    size: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Carts", cartsSchema);
