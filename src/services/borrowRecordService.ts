const BorrowRecordMod = require("../models/BorrowRecord");
const BorrowRecord = BorrowRecordMod?.default ?? BorrowRecordMod;
const OrderMod = require("../models/Order");
const Order = OrderMod?.default ?? OrderMod;
const TransactionMod = require("../models/Transaction");
const Transaction = TransactionMod?.default ?? TransactionMod;
const InventoryMod = require("../models/Inventory");
const Inventory = InventoryMod?.default ?? InventoryMod;
const AppErrorMod = require("../utils/AppError");
const AppError = AppErrorMod?.AppError ?? AppErrorMod?.default ?? AppErrorMod;

function parseIsReturnedFilter(query: any = {}) {
  if (query?.isReturned === "true") return true;
  if (query?.isReturned === "false") return false;
  return undefined;
}

async function getBorrowRecords(query: any = {}) {
  const isReturned = parseIsReturnedFilter(query);
  const filter =
    typeof isReturned === "boolean" ? { isReturned } : {};

  return BorrowRecord.find(filter)
    .populate("orderId")
    .populate("customerId")
    .populate("bookId")
    .sort({ createdAt: -1 });
}

async function getBorrowRecordsByBookId(bookId: any) {
  return BorrowRecord.find({ bookId })
    .populate("orderId")
    .populate("customerId")
    .populate("bookId")
    .sort({ createdAt: -1 });
}

async function getBorrowRecordsByCustomerId(customerId: any) {
  return BorrowRecord.find({ customerId })
    .populate("orderId")
    .populate("customerId")
    .populate("bookId")
    .sort({ createdAt: -1 });
}

async function getBorrowRecordById(id: any) {
  const record = await BorrowRecord.findById(id)
    .populate("orderId")
    .populate("customerId")
    .populate("bookId");

  if (!record) {
    throw new AppError("Borrow record not found", 404);
  }

  return record;
}

function calcLateFields(
  expectedReturnDate: any,
  actualReturnDate: any,
  lateFeePerDay: any,
) {
  if (!expectedReturnDate || !actualReturnDate) {
    return {
      lateDays: 0,
      totalLateFee: 0,
    };
  }

  const msPerDay = 24 * 60 * 60 * 1000;
  const diffMs = actualReturnDate.getTime() - expectedReturnDate.getTime();
  const lateDays = diffMs > 0 ? Math.ceil(diffMs / msPerDay) : 0;

  const totalLateFee = lateDays * (lateFeePerDay || 0);

  return { lateDays, totalLateFee };
}

function getActualReturnDate(data: any = {}) {
  if (!data.actualReturnDate) {
    return new Date();
  }

  const actualReturnDate = new Date(data.actualReturnDate);

  if (Number.isNaN(actualReturnDate.getTime())) {
    throw new AppError("actualReturnDate must be a valid date", 400);
  }

  return actualReturnDate;
}

function getLateFeePerDay(data: any = {}) {
  if (data.lateFeePerDay === undefined) {
    return 0;
  }

  const lateFeePerDay = Number(data.lateFeePerDay);

  if (!Number.isFinite(lateFeePerDay)) {
    throw new AppError("lateFeePerDay must be a number", 400);
  }

  return lateFeePerDay;
}

function getPositiveInteger(value: any, fieldName: string) {
  const numberValue = Number(value);

  if (!Number.isInteger(numberValue) || numberValue < 1) {
    throw new AppError(`${fieldName} must be a positive integer`, 400);
  }

  return numberValue;
}

async function getOrderById(orderId: any) {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new AppError("Order not found for borrow record", 404);
  }

  return order;
}

function getReturnQuantity(data: any = {}, remainingQuantity: number) {
  if (
    data.quantity === undefined ||
    data.quantity === null ||
    data.quantity === ""
  ) {
    return remainingQuantity;
  }

  return getPositiveInteger(data.quantity, "quantity");
}

async function restoreReturnedCopies(bookId: any, quantity: number) {
  const inventory = await Inventory.findOne({ bookId });

  if (!inventory) {
    throw new AppError("Inventory not found", 404);
  }

  inventory.availableCopies = (inventory.availableCopies || 0) + quantity;
  inventory.borrowedCopies = Math.max(
    (inventory.borrowedCopies || 0) - quantity,
    0,
  );

  return inventory.save();
}

function getPaymentMethod(data: any = {}) {
  if (typeof data.paymentMethod !== "string") {
    return "cash";
  }

  const paymentMethod = data.paymentMethod.trim();
  return paymentMethod || "cash";
}

async function returnBook(recordId: any, data: any = {}) {
  const record = await BorrowRecord.findById(recordId);
  if (!record) {
    throw new AppError("Borrow record not found", 404);
  }

  if (record.isReturned) {
    throw new AppError("Book already returned", 400);
  }

  const actualReturnDate = getActualReturnDate(data);
  const lateFeePerDay = getLateFeePerDay(data);
  const order = await getOrderById(record.orderId);
  const orderQuantity = getPositiveInteger(order.quantity, "order quantity");
  const currentReturnedQuantity = record.returnedQuantity || 0;
  const remainingQuantity = orderQuantity - currentReturnedQuantity;

  if (remainingQuantity <= 0) {
    throw new AppError("All borrowed copies are already returned", 400);
  }

  const returnQuantity = getReturnQuantity(data, remainingQuantity);

  if (returnQuantity > remainingQuantity) {
    throw new AppError(
      "quantity cannot be greater than remaining borrowed copies",
      400,
    );
  }

  const nextReturnedQuantity = currentReturnedQuantity + returnQuantity;
  const isFullyReturned = nextReturnedQuantity >= orderQuantity;

  const { lateDays, totalLateFee } = calcLateFields(
    record.expectedReturnDate,
    actualReturnDate,
    lateFeePerDay,
  );

  await restoreReturnedCopies(record.bookId, returnQuantity);

  record.returnedQuantity = nextReturnedQuantity;
  record.isReturned = isFullyReturned;

  const returnTransaction = await Transaction.create({
    orderId: record.orderId,
    transactionType: "return",
    customerId: record.customerId,
    bookId: record.bookId,
    quantity: returnQuantity,
    totalPrice: totalLateFee,
    paymentMethod: getPaymentMethod(data),
    transactionDate: actualReturnDate,
  });

  record.returnTransactionId = returnTransaction._id;

  if (isFullyReturned) {
    record.actualReturnDate = actualReturnDate;
    record.lateFeePerDay = lateFeePerDay || 0;
    record.lateDays = lateDays;
    record.totalLateFee = totalLateFee;
    order.orderStatus = "returned";
    await order.save();
  }

  const updatedRecord = await record.save();

  return {
    borrowRecord: updatedRecord,
    transaction: returnTransaction,
    returnedQuantity: returnQuantity,
    remainingQuantity: orderQuantity - nextReturnedQuantity,
  };
}

module.exports = {
  getBorrowRecords,
  getBorrowRecordsByBookId,
  getBorrowRecordsByCustomerId,
  getBorrowRecordById,
  returnBook,
};

export {
  getBorrowRecords,
  getBorrowRecordsByBookId,
  getBorrowRecordsByCustomerId,
  getBorrowRecordById,
  returnBook,
};
export default {
  getBorrowRecords,
  getBorrowRecordsByBookId,
  getBorrowRecordsByCustomerId,
  getBorrowRecordById,
  returnBook,
};
