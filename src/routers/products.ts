import express from "express";
import {
  create,
  getAll,
  update,
  remove,
  getById,
} from "../controllers/product";
import { isAdmin, verifyToken } from "../controllers/middlewares/authenticate";

const router = express.Router();

router.get("/products", getAll);
router.get("/products/:id", getById);
router.post("/products", verifyToken, isAdmin, create);
router.put("/products/:id", verifyToken, isAdmin, update);
router.delete("/products/:id", verifyToken, isAdmin, remove);

export default router;
