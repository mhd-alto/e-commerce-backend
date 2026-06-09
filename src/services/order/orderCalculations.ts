import AppErrorMod from "../../utils/AppError";

const AppError =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (AppErrorMod as any)?.AppError ??
  (AppErrorMod as any)?.default ??
  AppErrorMod;

const DEFAULT_MIN_COPIES_FOR_BORROWING = 3;

export function normalizeOrderType(orderType: any): string {
  return typeof orderType === "string" ? orderType.trim().toLowerCase() : "";
}

export function getOrderQuantity(quantity: any) {
  const orderQuantity = Number(quantity);

  if (!Number.isInteger(orderQuantity) || orderQuantity < 1) {
    throw new AppError("quantity must be a positive integer", 400);
  }

  return orderQuantity;
}

export function getBorrowingMinimum(inventory: any) {
  const minimum = Number(inventory.minCopiesForBorrowing);

  if (Number.isFinite(minimum) && minimum > 0) {
    return minimum;
  }

  return DEFAULT_MIN_COPIES_FOR_BORROWING;
}

export function getSalePrice(book: any) {
  const salePrice = Number(book?.salePrice);

  if (!Number.isFinite(salePrice) || salePrice < 0) {
    throw new AppError("Book salePrice must be a valid number", 400);
  }

  return salePrice;
}

export function getBorrowPrice(book: any) {
  const borrowPrice = Number(book?.borrowPrice);

  if (!Number.isFinite(borrowPrice) || borrowPrice < 0) {
    throw new AppError("Book borrowPrice must be a valid number", 400);
  }

  return borrowPrice;
}

export function getExpectedReturnDate(data: any = {}) {
  if (!data.expectedReturnDate) {
    throw new AppError("expectedReturnDate is required", 400);
  }

  const expectedReturnDate = new Date(data.expectedReturnDate);

  if (Number.isNaN(expectedReturnDate.getTime())) {
    throw new AppError("expectedReturnDate must be a valid date", 400);
  }

  return expectedReturnDate;
}

export function getBorrowDays(expectedReturnDate: Date) {
  const now = new Date();
  const diffMs = expectedReturnDate.getTime() - now.getTime();

  if (diffMs <= 0) {
    throw new AppError("expectedReturnDate must be in the future", 400);
  }

  return Math.ceil(diffMs / (24 * 60 * 60 * 1000));
}

export function getLateFeePerDay(data: any = {}) {
  if (data.lateFeePerDay === undefined) {
    return 0;
  }

  const lateFeePerDay = Number(data.lateFeePerDay);

  if (!Number.isFinite(lateFeePerDay) || lateFeePerDay < 0) {
    throw new AppError("lateFeePerDay must be a non-negative number", 400);
  }

  return lateFeePerDay;
}

export function getPaymentMethod(data: any = {}) {
  return typeof data.paymentMethod === "string" && data.paymentMethod.trim()
    ? data.paymentMethod.trim()
    : "cash";
}
