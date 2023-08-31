import express from "express";
import {
  create,
  getAll,
  update,
  remove,
  getById,
} from "../controllers/category";
import { isAdmin, verifyToken } from "../controllers/middlewares/authenticate";

const router = express.Router();

router.get("/categories", getAll);
router.get("/categories/:id", getById);
router.post("/categories", verifyToken, isAdmin, create);
router.put("/categories/:id", verifyToken, isAdmin, update);
router.delete("/categories/:id", verifyToken, isAdmin, remove);

export default router;
