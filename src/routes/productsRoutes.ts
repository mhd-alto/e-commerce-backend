import { Router } from "express";
import ProductController from "../controllers/productController";
import { authMiddleware } from "../middelwear/authMiddleware";
import { roleMiddleware } from "../middelwear/roleMiddleware";
const router = Router();

const productController = new ProductController();

router.get("/", productController.getAllProducts);

router.get("/:id", productController.getProdById);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  productController.createProd,
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  productController.editProd,
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  productController.deleteProd,
);

export default router;
