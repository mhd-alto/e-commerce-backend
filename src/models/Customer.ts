import mongoose, { HydratedDocument } from "mongoose";

export interface CustomerAttrs {
  fullName: string;
  phone: string;
  address?: string;
}

export type CustomerDoc = HydratedDocument<CustomerAttrs>;

const CustomerSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

export default mongoose.model<CustomerDoc>("Customer", CustomerSchema);
