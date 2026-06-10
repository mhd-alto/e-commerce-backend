import OrderModel from "../models/odersModel";
import ProductModel from "../models/productsModel";

export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export default class OrderService {
  async getAllOrder(): Promise<ServiceResponse<any>> {
    try {
      const orders = await OrderModel.find()
        .populate("productId")
        .populate("userId");

      return {
        success: true,
        data: orders,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async getOrderById(id: string): Promise<ServiceResponse<any>> {
    try {
      const order = await OrderModel.findById(id)
        .populate("productId")
        .populate("userId");

      if (!order) {
        return {
          success: false,
          error: "Order not found",
        };
      }

      return {
        success: true,
        data: order,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async createOrder(orderData: {
    productId: string;
    userId: string;
    quantity: number;
  }): Promise<ServiceResponse<any>> {
    try {
      const { productId, userId, quantity } = orderData;

      if (!productId || !userId || !quantity) {
        return {
          success: false,
          error: "All fields are required",
        };
      }

      const product = await ProductModel.findById(productId);

      if (!product) {
        return {
          success: false,
          error: "Product not found",
        };
      }

      const order = await OrderModel.create({
        productId,
        userId,
        quantity,
        price: product.price * quantity,
        status: "pending",
      });

      return {
        success: true,
        data: order,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async acceptOrder(id: string): Promise<ServiceResponse<any>> {
    try {
      const order = await OrderModel.findById(id);

      if (!order) {
        return {
          success: false,
          error: "Order not found",
        };
      }

      if (order.status !== "pending") {
        return {
          success: false,
          error: "Order already processed",
        };
      }

      const product = await ProductModel.findById(order.productId);

      if (!product) {
        return {
          success: false,
          error: "Product not found",
        };
      }

      if (product.quantity < order.quantity) {
        return {
          success: false,
          error: "Insufficient stock",
        };
      }

      product.quantity -= order.quantity;
       product.soldProducts++
      await product.save();

      order.status = "accepted";

      await order.save();

      return {
        success: true,
        data: order,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async rejectOrder(id: string): Promise<ServiceResponse<any>> {
    try {
      const order = await OrderModel.findById(id);

      if (!order) {
        return {
          success: false,
          error: "Order not found",
        };
      }

      if (order.status !== "pending") {
        return {
          success: false,
          error: "Order already processed",
        };
      }

      order.status = "rejected";

      await order.save();

      return {
        success: true,
        data: order,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}