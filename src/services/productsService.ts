import { isValidObjectId } from "mongoose";
import ProductModel from "../models/productsModel";

export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export default class ProductService {
  async getAllProducts(): Promise<ServiceResponse<any>> {
    try {
      const products = await ProductModel.find();

      return {
        success: true,
        data: products,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async getProductById(id: string): Promise<ServiceResponse<any>> {
    try {
      if (!isValidObjectId(id)) {
        return {
          success: false,
          error: "Invalid product id",
        };
      }

      const product = await ProductModel.findById(id);

      if (!product) {
        return {
          success: false,
          error: "Product not found",
        };
      }

      return {
        success: true,
        data: product,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async createProduct(productData: any): Promise<ServiceResponse<any>> {
    try {
      const product = await ProductModel.create(productData);

      return {
        success: true,
        data: product,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async editProd(id: string, productData: any): Promise<ServiceResponse<any>> {
    try {
      if (!isValidObjectId(id)) {
        return {
          success: false,
          error: "Invalid product id",
        };
      }

      const product = await ProductModel.findByIdAndUpdate(id, productData, {
        new: true,
      });

      if (!product) {
        return {
          success: false,
          error: "Product not found",
        };
      }

      return {
        success: true,
        data: product,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async deleteProd(id: string): Promise<ServiceResponse<any>> {
    try {
      if (!isValidObjectId(id)) {
        return {
          success: false,
          error: "Invalid product id",
        };
      }

      const product = await ProductModel.findByIdAndDelete(id);

      if (!product) {
        return {
          success: false,
          error: "Product not found",
        };
      }

      return {
        success: true,
        data: {
          message: "Product deleted successfully",
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
