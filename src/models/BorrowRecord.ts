const mongoose = require("mongoose");

const BorrowRecordSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
      required: true,
    },
    returnTransactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
    },

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

    borrowDate: { type: Date, required: true },
    expectedReturnDate: { type: Date, required: true },
    actualReturnDate: { type: Date },

    isReturned: { type: Boolean, required: true, default: false },
    returnedQuantity: { type: Number, default: 0, min: 0 },

    lateFeePerDay: { type: Number, default: 0, min: 0 },
    lateDays: { type: Number, default: 0, min: 0 },
    totalLateFee: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("BorrowRecord", BorrowRecordSchema);
