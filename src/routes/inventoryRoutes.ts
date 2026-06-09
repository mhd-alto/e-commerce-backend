const router = require("express").Router();

const inventoryController = require("../controllers/inventoryController");

router.get("/book/:bookId", inventoryController.getInventoryByBookId);
router.get("/", inventoryController.listInventories);

module.exports = router;

export default router;
