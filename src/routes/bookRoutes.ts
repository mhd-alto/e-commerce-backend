const router = require("express").Router();

const bookController = require("../controllers/bookController");
const { validationMiddleware } = require("../middleware/validationMiddleware");
const { validateBook } = require("../validations/bookValidation");

router.post("/", validationMiddleware(validateBook), bookController.createBook);
router.get("/", bookController.getBooks);
router.get("/:id", bookController.getBookById);
router.put("/:id", bookController.updateBook);
router.delete("/:id", bookController.deleteBook);

module.exports = router;

export default router;
