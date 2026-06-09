import mongoose, { HydratedDocument, Schema } from "mongoose";

export interface InventoryAttrs {
  bookId: mongoose.Types.ObjectId;
  totalCopies?: number;
  availableCopies?: number;
  borrowedCopies?: number;
  soldCopies?: number;
  minCopiesForBorrowing?: number;
}

export type InventoryDoc = HydratedDocument<InventoryAttrs>;

const InventorySchema = new mongoose.Schema(
  {
    bookId: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
      unique: true,
    },
    totalCopies: { type: Number, default: 0, min: 0 },
    availableCopies: { type: Number, default: 0, min: 0 },
    borrowedCopies: { type: Number, default: 0, min: 0 },
    soldCopies: { type: Number, default: 0, min: 0 },
    minCopiesForBorrowing: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<InventoryAttrs>("Inventory", InventorySchema);
