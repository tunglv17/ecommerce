import express from "express";
import {
  getAll,
  signup,
  authenticate,
  forgotPassword,
  resetPassword,
} from "../controllers/auth";
import { isAdmin, verifyToken } from "../controllers/middlewares/authenticate";

const router = express.Router();

router.get("/users", verifyToken, isAdmin, getAll);
router.post("/signup", signup);
router.post("/authenticate", authenticate);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
