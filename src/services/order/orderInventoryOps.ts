import AppErrorMod from "../../utils/AppError";

const AppError =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (AppErrorMod as any)?.AppError ??
  (AppErrorMod as any)?.default ??
  AppErrorMod;

export function getAvailableCopies(inventory: any) {
  return inventory.availableCopies || 0;
}

export function getTotalCopies(inventory: any) {
  return inventory.totalCopies || 0;
}

export function validateSaleInventory(inventory: any, quantity: number) {
  const availableCopies = getAvailableCopies(inventory);
  const totalCopies = getTotalCopies(inventory);

  if (availableCopies <= 0) {
    throw new AppError("Book is out of stock for sale", 400);
  }

  if (quantity > availableCopies) {
    throw new AppError("Not enough available copies for sale", 400);
  }

  if (quantity > totalCopies) {
    throw new AppError("Not enough total copies for sale", 400);
  }
}

export function applySaleInventoryUpdate(inventory: any, quantity: number) {
  inventory.availableCopies = (inventory.availableCopies || 0) - quantity;
  inventory.totalCopies = (inventory.totalCopies || 0) - quantity;
  inventory.soldCopies = (inventory.soldCopies || 0) + quantity;
}

export function rollbackSaleInventoryUpdate(inventory: any, quantity: number) {
  inventory.availableCopies = (inventory.availableCopies || 0) + quantity;
  inventory.totalCopies = (inventory.totalCopies || 0) + quantity;
  inventory.soldCopies = Math.max((inventory.soldCopies || 0) - quantity, 0);
}

export function validateBorrowInventory(
  inventory: any,
  quantity: number,
  minimumCopies: number,
) {
  const availableCopies = getAvailableCopies(inventory);

  if (availableCopies <= minimumCopies) {
    throw new AppError(
      `Cannot borrow this book unless more than ${minimumCopies} copies are available`,
      400,
    );
  }

  if (quantity > availableCopies) {
    throw new AppError("Not enough available copies for borrowing", 400);
  }
}

export function applyBorrowInventoryUpdate(inventory: any, quantity: number) {
  inventory.availableCopies = (inventory.availableCopies || 0) - quantity;
  inventory.borrowedCopies = (inventory.borrowedCopies || 0) + quantity;
}

export function rollbackBorrowInventoryUpdate(
  inventory: any,
  quantity: number,
) {
  inventory.availableCopies = (inventory.availableCopies || 0) + quantity;
  inventory.borrowedCopies = Math.max(
    (inventory.borrowedCopies || 0) - quantity,
    0,
  );
}
