const router = require("express").Router();

const orderController = require("../controllers/orderController");
const { validationMiddleware } = require("../middleware/validationMiddleware");
const { validateOrder } = require("../validations/orderValidation");

router.post(
  "/",
  validationMiddleware(validateOrder),
  orderController.createOrder,
);
router.post("/complete-buy/:buyOrderId", orderController.completeBuy);
router.post("/complete-borrow/:borrowOrderId", orderController.completeBorrow);
router.get("/customer/:customerId", orderController.getOrdersByCustomerId);
router.get("/", orderController.getOrders);
router.get("/:id", orderController.getOrderById);
router.patch("/:id/reject", orderController.rejectOrder);

module.exports = router;

export default router;
