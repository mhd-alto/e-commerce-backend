import { Router } from "express";
import OrderController from "../controllers/orderController";

const router = Router();

const ordersController = new OrderController();

router.get("/", ordersController.getAllOrder);
router.get("/:id", ordersController.getOrderById);
router.post("/", ordersController.createOrder);
router.put("/reject/:id", ordersController.rejectOrder);
router.put("/accept/:id", ordersController.acceptOrder);

export default router;