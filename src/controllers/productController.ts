import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import ProductService from "../services/productsService";

export default class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  public getAllProducts = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const result = await this.productService.getAllProducts();

    if (!result.success) {
      res.status(500).json({ error: result.error });
      return;
    }

    res.status(200).json(result.data);
  };

  public getProdById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (typeof id !== "string") {
      res.status(400).json({ error: "Invalid id" });
      return;
    }

    if (!isValidObjectId(id)) {
      res.status(400).json({ error: "Invalid product id" });
      return;
    }

    const result = await this.productService.getProductById(id);

    if (!result.success) {
      res.status(404).json({ error: result.error });
      return;
    }

    res.status(200).json(result.data);
  };

  public createProd = async (req: Request, res: Response): Promise<void> => {
    const result = await this.productService.createProduct(req.body);

    if (!result.success) {
      res.status(400).json({ error: result.error });
      return;
    }

    res.status(201).json(result.data);
  };

  public editProd = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (typeof id !== "string") {
      res.status(400).json({ error: "Invalid id" });
      return;
    }

    if (!isValidObjectId(id)) {
      res.status(400).json({ error: "Invalid product id" });
      return;
    }

    const result = await this.productService.editProd(id, req.body);

    if (!result.success) {
      res.status(404).json({ error: result.error });
      return;
    }

    res.status(200).json(result.data);
  };

  public deleteProd = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (typeof id !== "string") {
      res.status(400).json({ error: "Invalid id" });
      return;
    }

    if (!isValidObjectId(id)) {
      res.status(400).json({ error: "Invalid product id" });
      return;
    }

    const result = await this.productService.deleteProd(id);

    if (!result.success) {
      res.status(404).json({ error: result.error });
      return;
    }

    res.status(200).json(result.data);
  };
}
