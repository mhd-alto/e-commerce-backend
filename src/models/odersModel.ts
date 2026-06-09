import { Schema, model, Types } from "mongoose";

const ordersSchema = new Schema(
  {
    productId: {
      type: Types.ObjectId,
      ref: "Product",
      required: true,
    },

    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    isApproved: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const OrdersModel = model("Order", ordersSchema);

export default OrdersModel;