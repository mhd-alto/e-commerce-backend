import mongoose, { HydratedDocument, Schema } from "mongoose";

export interface BookAttrs {
  title: string;
  isbn: string;
  authors?: string[];
  description?: string;
  contentType?: string;
  category?: string;
  language?: string;
  borrowPrice?: number;
  salePrice?: number;
}

export type BookDoc = HydratedDocument<BookAttrs>;

const BookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    isbn: { type: String, index: true, unique: true, sparse: true, trim: true },
    authors: [{ type: String, trim: true }],
    description: { type: String, default: "", trim: true },
    contentType: { type: String, default: "", trim: true },
    category: { type: String, default: "", trim: true },
    language: { type: String, default: "", trim: true },
    borrowPrice: { type: Number, default: 0, min: 0 },
    salePrice: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<BookDoc>("Book", BookSchema);
