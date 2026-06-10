import { Router } from "express";
import AuthController from "../controllers/authController";
import { authMiddleware } from "../middelwear/authMiddleware";

const authController = new AuthController();

const router = Router();

router.post("/register", authController.registerUser);
router.post("/admin/register", authController.registerAdmin);
router.post("/login", authController.login);

export default router;