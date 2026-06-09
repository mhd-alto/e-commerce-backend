const router = require("express").Router();

const borrowRecordController = require("../controllers/borrowRecordController");

router.get("/", borrowRecordController.getBorrowRecords);
router.get("/book/:bookId", borrowRecordController.getBorrowRecordsByBookId);
router.get("/customer/:customerId", borrowRecordController.getBorrowRecordsByCustomerId);
router.get("/:id", borrowRecordController.getBorrowRecordById);
router.post("/:id/return", borrowRecordController.returnBook);

module.exports = router;

export default router;
