const InventoryMod = require("../models/Inventory");
const Inventory = InventoryMod?.default ?? InventoryMod;
const AppErrorMod = require("../utils/AppError");
const AppError = AppErrorMod?.AppError ?? AppErrorMod?.default ?? AppErrorMod;

const inventoryNumberFields = [
  "totalCopies",
  "availableCopies",
  "borrowedCopies",
  "soldCopies",
  "minCopiesForBorrowing",
];

function toNumber(value: any, fieldName: string) {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) {
    throw new AppError(`${fieldName} must be a number`, 400);
  }

  return numberValue;
}

function toPositiveInteger(value: any, fieldName: string) {
  const numberValue = toNumber(value, fieldName);

  if (!Number.isInteger(numberValue) || numberValue < 1) {
    throw new AppError(`${fieldName} must be a positive integer`, 400);
  }

  return numberValue;
}

function buildInventoryUpdate(data: any = {}) {
  const bookId = data.bookId;

  if (!bookId) {
    throw new AppError("bookId is required", 400);
  }

  const update: any = { bookId };

  for (const field of inventoryNumberFields) {
    if (data[field] !== undefined) {
      update[field] = toNumber(data[field], field);
    }
  }

  if (data.quantity !== undefined && update.totalCopies === undefined) {
    update.totalCopies = toNumber(data.quantity, "quantity");
  }

  if (
    update.totalCopies !== undefined &&
    update.availableCopies === undefined
  ) {
    update.availableCopies = update.totalCopies;
  }

  return update;
}

function getRemovalQuantity(value: any, availableCopies: number) {
  if (value === undefined || value === null || value === "") {
    return availableCopies;
  }

  return toPositiveInteger(value, "quantity");
}

async function upsertInventory(data: any) {
  const update = buildInventoryUpdate(data);

  return Inventory.findOneAndUpdate(
    { bookId: update.bookId },
    { $set: update },
    { new: true, upsert: true, runValidators: true },
  );
}

async function adjustAvailability(bookId: any, delta: any) {
  const quantityDelta = toNumber(delta, "delta");
  const inv = await Inventory.findOne({ bookId });
  if (!inv) return null;

  const next = inv.availableCopies + quantityDelta;
  if (next < 0) return null;

  inv.availableCopies = next;
  return inv.save();
}

async function getInventoryByBookId(bookId: any) {
  const inventory = await Inventory.findOne({ bookId });

  if (!inventory) {
    throw new AppError("Inventory not found", 404);
  }

  return inventory;
}

async function listInventories() {
  return Inventory.find().populate("bookId");
}

async function removeBookCopies(bookId: any, quantityValue?: any) {
  const inventory = await Inventory.findOne({ bookId });

  if (!inventory) {
    throw new AppError("Inventory not found", 404);
  }

  const totalCopies = inventory.totalCopies || 0;
  const availableCopies = inventory.availableCopies || 0;
  const quantity = getRemovalQuantity(quantityValue, availableCopies);

  if (quantity > totalCopies) {
    throw new AppError("quantity cannot be greater than available copies ", 400);
  }

  if (quantity === totalCopies) {
    await Inventory.findOneAndDelete({ bookId });

    return {
      allCopiesRemoved: true,
      inventory: null,
      removedQuantity: quantity,
    };
  }

  if (quantity > availableCopies) {
    throw new AppError("quantity cannot be greater than available copies", 400);
  }

  inventory.totalCopies = totalCopies - quantity;
  inventory.availableCopies = availableCopies - quantity;

  return {
    allCopiesRemoved: false,
    inventory: await inventory.save(),
    removedQuantity: quantity,
  };
}

module.exports = {
  upsertInventory,
  adjustAvailability,
  getInventoryByBookId,
  listInventories,
  removeBookCopies,
};

export {
  upsertInventory,
  adjustAvailability,
  getInventoryByBookId,
  listInventories,
  removeBookCopies,
};

export default {
  upsertInventory,
  adjustAvailability,
  getInventoryByBookId,
  listInventories,
  removeBookCopies,
};
