const router = require("express").Router();

router.use("/books", require("./bookRoutes"));
router.use("/inventories", require("./inventoryRoutes"));
router.use("/book-inventory", require("./inventoryRoutes"));
router.use("/customers", require("./customerRoutes"));
router.use("/order", require("./orderRoutes"));
router.use("/orders", require("./orderRoutes"));
router.use("/transactions", require("./transactionRoutes"));
router.use("/borrow-records", require("./borrowRecordRoutes"));

module.exports = router;

export default router;
