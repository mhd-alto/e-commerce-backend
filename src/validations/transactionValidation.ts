function validateTransaction(req: any) {
  const errors: any[] = [];
  const {
    orderId,
    transactionType,
    customerId,
    bookId,
    quantity,
    totalPrice,
    transactionDate,
  } = req.body || {};

  if (!orderId) errors.push({ field: "orderId", message: "orderId is required" });
  if (!transactionType || typeof transactionType !== "string")
    errors.push({
      field: "transactionType",
      message: "transactionType is required",
    });

  if (!customerId)
    errors.push({ field: "customerId", message: "customerId is required" });
  if (!bookId) errors.push({ field: "bookId", message: "bookId is required" });

  if (
    quantity === undefined ||
    Number.isNaN(Number(quantity)) ||
    Number(quantity) < 1
  ) {
    errors.push({ field: "quantity", message: "quantity must be >= 1" });
  }

  if (
    totalPrice === undefined ||
    Number.isNaN(Number(totalPrice)) ||
    Number(totalPrice) < 0
  ) {
    errors.push({ field: "totalPrice", message: "totalPrice must be >= 0" });
  }

  if (!transactionDate || Number.isNaN(new Date(transactionDate).getTime())) {
    errors.push({
      field: "transactionDate",
      message: "transactionDate is required",
    });
  }

  return errors;
}

module.exports = { validateTransaction };

export { validateTransaction };
export default { validateTransaction };
