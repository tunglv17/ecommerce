import express from "express";
import { create, upload } from "../controllers/file";

const router = express.Router();

router.post("/files", create);

export default router;
