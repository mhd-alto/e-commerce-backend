import { Router } from "express";
import ProductController from "../controllers/productController";

const router = Router();

const productController = new ProductController();

router.get("/", productController.getAllProducts);

router.get("/:id", productController.getProdById);

router.post("/", productController.createProd);

router.put("/:id", productController.editProd);

router.delete("/:id", productController.deleteProd);

export default router;