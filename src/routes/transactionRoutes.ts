const router = require("express").Router();

const transactionController = require("../controllers/transactionController");

router.get("/", transactionController.getTransactions);
router.get("/by-order/:orderId", transactionController.getTransactionByOrderId);

module.exports = router;

export default router;
