import { NextFunction, Request, Response } from "express";
import Ordes from "../../models/order";

const create = async (req: Request, res: Response, next: NextFunction) => {
  const {
    userId,
    productId,
    cartId,
    quantity,
    shippingAdrres,
    orderAdrres,
    orderPhone,
    orderDate,
    orderStatus,
  } = req.body;

  try {
    if (
      !userId ||
      !productId ||
      !cartId ||
      !quantity ||
      !shippingAdrres ||
      !orderAdrres ||
      !orderPhone ||
      !orderDate ||
      !orderStatus
    ) {
      console.log("!");
      return res.status(400).json({
        error: "Field is required",
      });
    }

    const orderProduct = new Ordes(req.body);

    const data = await orderProduct.save();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
    next();
  }
};

export { create };
