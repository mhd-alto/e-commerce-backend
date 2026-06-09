import AppErrorMod from "../../utils/AppError";

const AppError =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (AppErrorMod as any)?.AppError ??
  (AppErrorMod as any)?.default ??
  AppErrorMod;

export function getDocumentId(value: any) {
  return value?._id ?? value;
}

export function ensureBookExists(book: any) {
  if (!book) {
    throw new AppError("Book not found", 404);
  }

  return book;
}

export function ensureOrderExists(order: any) {
  if (!order) {
    throw new AppError("Order not found", 404);
  }

  return order;
}

export function getQueryString(value: any) {
  const rawValue = Array.isArray(value) ? value[0] : value;

  if (typeof rawValue !== "string") {
    return undefined;
  }

  const trimmedValue = rawValue.trim();
  return trimmedValue.length ? trimmedValue : undefined;
}
