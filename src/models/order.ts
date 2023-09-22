import mongoose from "mongoose";

const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const ordersSchema = new Schema(
  {
    userId: { type: ObjectId, ref: "Users", required: true },
    productId: { type: ObjectId, ref: "Products", required: true },
    cartId: { type: ObjectId, ref: "Carts", required: true },
    price: { type: String, required: true },
    quantity: { type: String, required: true },
    size: { type: String, required: false },
    color: { type: String, required: false },
    shippingAdrres: { type: String, required: true },
    orderAdrres: { type: String, required: true },
    orderPhone: { type: String, required: true },
    orderDate: { type: String, required: true },
    orderStatus: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Orders", ordersSchema);
