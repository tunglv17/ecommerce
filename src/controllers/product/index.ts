import { NextFunction, Request, Response } from "express";
import Products from "../../models/product";
import { isEmpty } from "lodash";

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  const limit: any = req.query.$limit || "";
  const sort: any = req.query.$sort || "";

  try {
    const data = await Products.find().limit(limit).sort(sort);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
    next();
  }
};

const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await Products.findById(req.params.id).exec();
    if (isEmpty(data)) {
      return res.status(404).json({
        error: "Product not found",
      });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
    next();
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  const { name, thumbnail, price, images, description, category_id } = req.body;

  try {
    if (
      !name ||
      !thumbnail ||
      !price ||
      !images ||
      !description ||
      !category_id
    ) {
      return res.status(400).json({
        error: "Field is required",
      });
    }

    const product = new Products(req.body);
    const data = await product.save();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
    next();
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  const { name, thumbnail, price, images, description, category_id } = req.body;

  try {
    if (
      !name ||
      !thumbnail ||
      !price ||
      !images ||
      !description ||
      !category_id
    ) {
      return res.status(400).json({
        error: "Field is required",
      });
    }
    await Products.updateOne({ _id: req.params.id }, req.body);
    res.status(200).json(req.body);
  } catch (error) {
    res.status(500).json(error);
    next();
  }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await Products.findOne({ _id: req.params.id });
    if (isEmpty(data)) {
      return res.status(404).json({ message: "Product not found" });
    }
    await Products.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Ok" });
  } catch (error) {
    res.status(500).json(error);
    next();
  }
};

export { getAll, create, update, remove, getById };
