import mongoose from "mongoose";

const Schema = mongoose.Schema;
const categoriesSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: false },
    thumbnail: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Categories", categoriesSchema);
