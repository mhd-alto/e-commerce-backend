function validateOrder(req: any) {
  const errors: any[] = [];
  const { bookId, customerId, orderType,quantity } =
    req.body || {};
console.log({ bookId, customerId, orderType,quantity });
  if (!bookId) {
    errors.push({ field: "bookId", message: "bookId is required" });
  }

  if (!customerId) {
    errors.push({ field: "customerId", message: "customerId is required" });
  }

  if (!orderType || typeof orderType !== "string") {
    errors.push({ field: "orderType", message: "orderType is required" });
  }

  // if (!orderStatus || typeof orderStatus !== "string") {
  //   errors.push({ field: "orderStatus", message: "orderStatus is required" });
  // }

  // if (!orderDate || Number.isNaN(new Date(orderDate).getTime())) {
  //   errors.push({ field: "orderDate", message: "orderDate is required" });
  // }

  if (quantity === undefined || Number.isNaN(Number(quantity)) || Number(quantity) < 1) {
    errors.push({ field: "quantity", message: "quantity must be >= 1" });
  }

  return errors;
}

module.exports = { validateOrder };

export { validateOrder };
export default { validateOrder };
