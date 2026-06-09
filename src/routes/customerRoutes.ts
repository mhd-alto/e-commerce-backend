const router = require("express").Router();

const customerController = require("../controllers/customerController");
const { validationMiddleware } = require("../middleware/validationMiddleware");
const { validateCustomer } = require("../validations/customerValidation");

router.post(
  "/",
  validationMiddleware(validateCustomer),
  customerController.createCustomer,
);
router.get("/", customerController.getCustomers);
router.get("/:id", customerController.getCustomerById);
router.put("/:id", customerController.updateCustomer);
router.delete("/:id", customerController.deleteCustomer);

module.exports = router;

export default router;
