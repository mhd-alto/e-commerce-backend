const TransactionMod = require("../models/Transaction");
const Transaction = TransactionMod?.default ?? TransactionMod;
const AppErrorMod = require("../utils/AppError");
const AppError = AppErrorMod?.AppError ?? AppErrorMod?.default ?? AppErrorMod;

function getQueryString(value: any) {
  const rawValue = Array.isArray(value) ? value[0] : value;

  if (typeof rawValue !== "string") {
    return undefined;
  }

  const trimmedValue = rawValue.trim();
  return trimmedValue.length ? trimmedValue : undefined;
}

function ensureTransactionExists(transaction: any) {
  if (!transaction) {
    throw new AppError("Transaction not found", 404);
  }

  return transaction;
}

function buildTransactionQuery(filters: any = {}) {
  const query: any = {};
  const transactionType =
    getQueryString(filters.type) ?? getQueryString(filters.transactionType);

  if (transactionType) {
    query.transactionType = transactionType;
  }

  return query;
}

async function getTransactions(filters: any = {}) {
  return Transaction.find(buildTransactionQuery(filters))
    .populate("orderId")
    .populate("customerId")
    .populate("bookId")
    .sort({ createdAt: -1 });
}

async function getTransactionByOrderId(orderId: any) {
  return ensureTransactionExists(await Transaction.findOne({ orderId }));
}

module.exports = {
  getTransactions,
  getTransactionByOrderId,
};

export {
  getTransactions,
  getTransactionByOrderId,
};

export default {
  getTransactions,
  getTransactionByOrderId,
};
