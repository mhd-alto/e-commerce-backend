import { Request, Response } from "express";
import OrderService from "../services/ordersService";

export default class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  public getAllOrder = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const result = await this.orderService.getAllOrder();

      if (!result.success) {
        res.status(500).json({ error: result.error });
        return;
      }

      res.status(200).json(result.data);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  public getOrderById = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
if (typeof id !== "string") {
  res.status(400).json({ error: "Invalid id" });
  return;
}

      const result = await this.orderService.getOrderById(id);

      if (result.success) {
        res.status(200).json(result.data);
        return;
      }

      res.status(404).json({ error: result.error });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  public createOrder = async (
    req: any,
    res: Response
  ): Promise<void> => {
    try {
            const userId = req.user.userId;

      const result = await this.orderService.createOrder({ ...req.body, userId });

      if (result.success) {
        res.status(201).json({
          data: result.data,
        });
        return;
      }

      if (result.error === "All fields are required") {
        res.status(400).json({ error: result.error });
        return;
      }

      if (result.error === "Product not found") {
        res.status(404).json({ error: result.error });
        return;
      }

      res.status(500).json({ error: result.error });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  public rejectOrder = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
if (typeof id !== "string") {
  res.status(400).json({ error: "Invalid id" });
  return;
}

      const result = await this.orderService.rejectOrder(id);

      if (result.success) {
        res.status(200).json(result.data);
        return;
      }

      res.status(404).json({ error: result.error });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  public acceptOrder = async (
    req: Request<{id:string}>,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
if (typeof id !== "string") {
  res.status(400).json({ error: "Invalid id" });
  return;
}

      const result = await this.orderService.acceptOrder(id);

      if (result.success) {
        res.status(200).json(result.data);
        return;
      }

      res.status(404).json({ error: result.error });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
}