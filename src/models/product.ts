import mongoose from "mongoose";

const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const categoriesSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    thumbnail: { type: String, required: true },
    images: { type: Array, required: true },
    categoryId: { type: ObjectId, ref: "Categories", required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Products", categoriesSchema);
