import express from "express";
import { registerUser ,registerAdmin } from "../controllers/authController";

const router = express.Router();

router.post("/register", registerUser);
router.post("/admin/register", registerAdmin);

export default router
