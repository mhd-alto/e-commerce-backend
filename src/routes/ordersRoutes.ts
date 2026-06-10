import { Router } from "express";
import OrderController from "../controllers/orderController";
import { authMiddleware } from "../middelwear/authMiddleware";
import { roleMiddleware } from "../middelwear/roleMiddleware";
const router = Router();

const ordersController = new OrderController();

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  ordersController.getAllOrder,
);
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "user"]),
  ordersController.getOrderById,
);
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin", "user"]),
  ordersController.createOrder,
);
router.put(
  "/reject/:id",
  authMiddleware,
  roleMiddleware("admin"),
  ordersController.rejectOrder,
);
router.put(
  "/accept/:id",
  authMiddleware,
  roleMiddleware("admin"),
  ordersController.acceptOrder,
);

export default router;
