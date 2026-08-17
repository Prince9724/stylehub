import { signIn } from "../controllers/adminController.js";
import express from "express";

const router = express.Router();
router.post("/", signIn);

export default router;