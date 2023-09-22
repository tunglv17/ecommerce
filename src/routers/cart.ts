import express from "express";
import { getAll, create, remove, update } from "../controllers/cart";
import { verifyToken } from "../controllers/middlewares/authenticate";

const router = express.Router();

router.get("/carts", verifyToken, getAll);
router.post("/carts", verifyToken, create);
router.delete("/carts/:id", verifyToken, remove);
router.put("/carts/:id", verifyToken, update);

export default router;
