import { Router } from "express";
import ResetPasswordController from "../controllers/resetPasswordController";

const router = Router();
const resetPasswordController = new ResetPasswordController();

router.post("/", resetPasswordController.resetPassword);
router.post("/confirm", resetPasswordController.confirmPassword);

export default router;
