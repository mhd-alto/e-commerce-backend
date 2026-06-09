 import mongoose, { HydratedDocument } from "mongoose";

export interface TransactionAttrs {
  orderId: mongoose.Types.ObjectId;
  transactionType: string;
  customerId: mongoose.Types.ObjectId;
  bookId: mongoose.Types.ObjectId;
  quantity: number;
  totalPrice: number;
  transactionDate: Date;
}

export type TransactionDoc = HydratedDocument<TransactionAttrs>;

const TransactionSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    transactionType: { type: String, required: true, trim: true },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    quantity: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, required: true, min: 0 },
    paymentMethod: { type: String, default: "cash", trim: true },
    transactionDate: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<TransactionDoc>("Transaction", TransactionSchema);
