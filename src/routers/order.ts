import express from "express";
import { create } from "../controllers/orders";
import { verifyToken } from "../controllers/middlewares/authenticate";

const router = express.Router();

router.post("/orders", verifyToken, create);

export default router;
