import mongoose, { HydratedDocument } from "mongoose";

export interface OrderAttrs {
  bookId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  orderType: string;
  orderStatus: string;
  orderDate: Date;
  quantity: number;
}

export type OrderDoc = HydratedDocument<OrderAttrs>;

const OrderSchema = new mongoose.Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    orderType: { type: String, required: true, trim: true },
    orderStatus: { type: String, required: true, trim: true },
    orderDate: { type: Date, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { timestamps: true }
);

export default mongoose.model<OrderDoc>("Order", OrderSchema);
