import { NextFunction, Request, Response } from "express";
import Categories from "../../models/category";
import { isEmpty } from "lodash";

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  const limit: any = req.query.$limit || "";
  const sort: any = req.query.$sort || "";
  try {
    const data = await Categories.find().limit(limit).sort(sort);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
    next();
  }
};

const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await Categories.findById(req.params.id).exec();
    if (isEmpty(data)) {
      return res.status(404).json({
        error: "Category not found",
      });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
    next();
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  const { name, thumbnail } = req.body;

  if (!name || !thumbnail) {
    return res.status(400).json({
      error: "Field is required",
    });
  }

  try {
    const category = new Categories(req.body);
    const data = await category.save();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
    next();
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Categories.updateOne({ _id: req.params.id }, req.body);
    res.status(200).json(req.body);
  } catch (error) {
    res.status(500).json(error);
    next();
  }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await Categories.findOne({ _id: req.params.id });
    if (isEmpty(data)) {
      return res.status(404).json({ message: "Category not found" });
    }
    await Categories.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Ok" });
  } catch (error) {
    res.status(500).json(error);
    next();
  }
};

export { getAll, create, update, remove, getById };
