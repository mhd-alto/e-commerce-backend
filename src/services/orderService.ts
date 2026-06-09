const OrderMod = require("../models/Order");
const Order = OrderMod?.default ?? OrderMod;
const BookMod = require("../models/Book");
const Book = BookMod?.default ?? BookMod;
const InventoryMod = require("../models/Inventory");
const Inventory = InventoryMod?.default ?? InventoryMod;
const TransactionMod = require("../models/Transaction");
const Transaction = TransactionMod?.default ?? TransactionMod;
const BorrowRecordMod = require("../models/BorrowRecord");
const BorrowRecord = BorrowRecordMod?.default ?? BorrowRecordMod;
const inventoryService = require("./inventoryService");

const AppErrorMod = require("../utils/AppError");
const AppError = AppErrorMod?.AppError ?? AppErrorMod?.default ?? AppErrorMod;

const {
  getQueryString,
  ensureOrderExists,
  getDocumentId,
  ensureBookExists,
} = require("./order/orderHelpers");

const {
  normalizeOrderType,
  getOrderQuantity,
  getBorrowingMinimum,
  getPaymentMethod,
  getSalePrice,
  getBorrowPrice,
  getExpectedReturnDate,
  getBorrowDays,
  getLateFeePerDay,
} = require("./order/orderCalculations");

const {
  validateSaleInventory,
  applySaleInventoryUpdate,
  rollbackSaleInventoryUpdate,
  validateBorrowInventory,
  applyBorrowInventoryUpdate,
  rollbackBorrowInventoryUpdate,
} = require("./order/orderInventoryOps");

async function validateOrderAvailability(data: any = {}) {
  const orderType = normalizeOrderType(data.orderType);
  const quantity = getOrderQuantity(data.quantity);
  const inventory = await inventoryService.getInventoryByBookId(data.bookId);
  const availableCopies = inventory.availableCopies || 0;

  if (orderType === "buy") {
    if (availableCopies <= 0) {
      throw new AppError("Book is out of stock for sale", 400);
    }

    if (quantity > availableCopies) {
      throw new AppError("Not enough available copies for sale", 400);
    }

    return;
  }

  if (orderType === "borrow") {
    const minimumCopies = getBorrowingMinimum(inventory);

    if (availableCopies < minimumCopies) {
      throw new AppError(
        `Cannot borrow this book unless at least ${minimumCopies} copies are available`,
        400,
      );
    }

    if (quantity > availableCopies) {
      throw new AppError("Not enough available copies for borrowing", 400);
    }

    return;
  }

  throw new AppError("orderType must be buy or borrow", 400);
}

async function createOrder(data: any = {}) {
  await validateOrderAvailability(data);

  return Order.create({
    ...data,
    orderStatus: data.orderStatus || "pending",
    orderDate: data.orderDate || new Date(),
  });
}

async function getBuyOrderForCompletion(orderId: any) {
  const order = ensureOrderExists(
    await Order.findById(orderId).populate("bookId"),
  );

  if (normalizeOrderType(order.orderType) !== "buy") {
    throw new AppError(
      "Only buy orders can be completed with this endpoint",
      400,
    );
  }

  if (normalizeOrderType(order.orderStatus) === "completed") {
    throw new AppError("Order is already completed", 400);
  }

  return order;
}

async function getBorrowOrderForCompletion(orderId: any) {
  const order = ensureOrderExists(
    await Order.findById(orderId).populate("bookId"),
  );

  if (normalizeOrderType(order.orderType) !== "borrow") {
    throw new AppError(
      "Only borrow orders can be completed with this endpoint",
      400,
    );
  }

  if (normalizeOrderType(order.orderStatus) === "completed") {
    throw new AppError("Order is already completed", 400);
  }

  return order;
}

async function getBookById(bookId: any) {
  return Book.findById(bookId);
}

async function getInventoryForSale(bookId: any) {
  const inventory = await Inventory.findOne({ bookId });

  if (!inventory) {
    throw new AppError("Inventory not found", 404);
  }

  return inventory;
}

async function getInventoryForBorrow(bookId: any) {
  const inventory = await Inventory.findOne({ bookId });

  if (!inventory) {
    throw new AppError("Inventory not found", 404);
  }

  return inventory;
}

async function completeBuy(orderId: any, data: any = {}) {
  const order = await getBuyOrderForCompletion(orderId);
  const bookId = getDocumentId(order.bookId);
  const book = ensureBookExists(
    order.bookId?._id ? order.bookId : await getBookById(bookId),
  );
  const quantity = getOrderQuantity(order.quantity);
  const inventory = await getInventoryForSale(bookId);
  const totalPrice = quantity * getSalePrice(book);
  let transaction: any;
  let inventoryUpdated = false;

  validateSaleInventory(inventory, quantity);

  try {
    applySaleInventoryUpdate(inventory, quantity);
    await inventory.save();
    inventoryUpdated = true;

    transaction = await Transaction.create({
      orderId: order._id,
      transactionType: "buy",
      customerId: getDocumentId(order.customerId),
      bookId,
      quantity,
      totalPrice,
      paymentMethod: getPaymentMethod(data),
      transactionDate: new Date(),
    });

    order.orderStatus = "completed";
    const completedOrder = await order.save();

    return {
      order: completedOrder,
      transaction,
      inventory,
      finalPrice: totalPrice,
    };
  } catch (error) {
    if (transaction?._id) {
      await Transaction.findByIdAndDelete(transaction._id);
    }

    if (inventoryUpdated) {
      rollbackSaleInventoryUpdate(inventory, quantity);
      await inventory.save();
    }

    throw error;
  }
}

async function completeBorrow(orderId: any, data: any = {}) {
  const order = await getBorrowOrderForCompletion(orderId);
  const bookId = getDocumentId(order.bookId);
  const book = ensureBookExists(
    order.bookId?._id ? order.bookId : await getBookById(bookId),
  );
  const quantity = getOrderQuantity(order.quantity);
  const inventory = await getInventoryForBorrow(bookId);
  const expectedReturnDate = getExpectedReturnDate(data);
  const borrowDays = getBorrowDays(expectedReturnDate);
  const lateFeePerDay = getLateFeePerDay(data);
  const totalPrice = quantity * getBorrowPrice(book) * borrowDays;
  let transaction: any;
  let borrowRecord: any;
  let inventoryUpdated = false;

  validateBorrowInventory(inventory, quantity);

  try {
    applyBorrowInventoryUpdate(inventory, quantity);
    await inventory.save();
    inventoryUpdated = true;

    transaction = await Transaction.create({
      orderId: order._id,
      transactionType: "borrow",
      customerId: getDocumentId(order.customerId),
      bookId,
      quantity,
      totalPrice,
      paymentMethod: getPaymentMethod(data),
      transactionDate: new Date(),
    });

    borrowRecord = await BorrowRecord.create({
      orderId: order._id,
      transactionId: transaction._id,
      returnTransactionId: null,
      customerId: getDocumentId(order.customerId),
      bookId,
      borrowDate: new Date(),
      expectedReturnDate,
      lateFeePerDay,
      isReturned: false,
    });

    order.orderStatus = "completed";
    const completedOrder = await order.save();

    return {
      order: completedOrder,
      transaction,
      borrowRecord,
      inventory,
      finalPrice: totalPrice,
      borrowDays,
    };
  } catch (error) {
    if (borrowRecord?._id) {
      await BorrowRecord.findByIdAndDelete(borrowRecord._id);
    }

    if (transaction?._id) {
      await Transaction.findByIdAndDelete(transaction._id);
    }

    if (inventoryUpdated) {
      rollbackBorrowInventoryUpdate(inventory, quantity);
      await inventory.save();
    }

    throw error;
  }
}

async function getOrders(filter: any = {}) {
  const q: any = {};
  const status =
    getQueryString(filter.status) ?? getQueryString(filter.orderStatus);

  if (status) {
    q.orderStatus = status;
  }

  return Order.find(q)
    .populate("customerId")
    .populate("bookId")
    .sort({ createdAt: -1 });
}

async function getOrdersByCustomerId(customerId: any) {
  const ordersPromise = Order.find({ customerId })
    .populate("customerId")
    .populate("bookId")
    .sort({ createdAt: -1 });

  const latestTransactionPromise = Transaction.findOne({ customerId })
    .populate("orderId")
    .populate("bookId")
    .sort({ transactionDate: -1, createdAt: -1 });

  const [orders, latestTransaction] = await Promise.all([
    ordersPromise,
    latestTransactionPromise,
  ]);

  return { latestTransaction, orders };
}

async function getOrderById(id: any) {
  const order = await Order.findById(id)
    .populate("customerId")
    .populate("bookId");
  return ensureOrderExists(order);
}

async function rejectOrder(id: any) {
  const order = await Order.findByIdAndUpdate(
    id,
    { orderStatus: "rejected" },
    { new: true, runValidators: true },
  );

  return ensureOrderExists(order);
}

module.exports = {
  createOrder,
  getOrders,
  getOrdersByCustomerId,
  getOrderById,
  rejectOrder,
  completeBuy,
  completeBorrow,
};

export {
  createOrder,
  getOrders,
  getOrdersByCustomerId,
  getOrderById,
  rejectOrder,
  completeBuy,
  completeBorrow,
};

export default {
  createOrder,
  getOrders,
  getOrdersByCustomerId,
  getOrderById,
  rejectOrder,
  completeBuy,
  completeBorrow,
};
