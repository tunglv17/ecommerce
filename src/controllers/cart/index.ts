import { NextFunction, Request, Response } from "express";
import Carts from "../../models/cart";
import { getUserFromToken } from "../hook";
import { UserT } from "../../types/user";
import { isEmpty } from "lodash";

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  const limit: any = req.query.$limit || "";
  const sort: any = req.query.$sort || "";
  const accessToken = req.headers.authorization?.slice(7) as string;

  const user: UserT = getUserFromToken(accessToken);
  try {
    const data = await Carts.find({
      userId: user._id,
    })
      .limit(limit)
      .sort(sort);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
    next();
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  const { userId, productId } = req.body;

  if (!userId || !productId) {
    return res.status(400).json({
      error: "Field is required",
    });
  }
  try {
    const checkExistCart = await Carts.find({
      productId: productId,
      userId: userId,
    });
    if (!isEmpty(checkExistCart)) {
      return res.status(400).json({
        error: "The product already exists in the shopping cart",
      });
    }
    const cart = new Carts(req.body);
    const data = await cart.save();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
    next();
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.body;
  try {
    const cartUpdate = await Carts.find({
      _id: req.params.id,
      userId: userId,
    });
    if (isEmpty(cartUpdate)) {
      return res.status(404).json({ message: "Cart not found" });
    }
    await Carts.updateOne({ _id: req.params.id }, req.body);
    res.status(200).json(req.body);
  } catch (error) {
    res.status(500).json(error);
    next();
  }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.headers.authorization?.slice(7) as string;

  const user: UserT = getUserFromToken(accessToken);
  try {
    const data = await Carts.findOne({ _id: req.params.id, userId: user._id });
    if (isEmpty(data)) {
      return res.status(404).json({ message: "Not found" });
    }
    await Carts.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Ok" });
  } catch (error) {
    res.status(500).json(error);
    next();
  }
};

export { getAll, create, remove, update };
