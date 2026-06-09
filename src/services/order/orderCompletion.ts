import AppErrorMod from "../../utils/AppError";

const AppError =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (AppErrorMod as any)?.AppError ??
  (AppErrorMod as any)?.default ??
  AppErrorMod;

export async function completeOrderWithRollback(params: {
  validate: () => Promise<void> | void;
  applyInventory: () => Promise<void> | void;
  rollbackInventory: () => Promise<void> | void;
  createTransaction: () => Promise<any>;
  createBorrowRecord?: () => Promise<any>;
  finalizeOrder: (transaction: any, borrowRecord?: any) => Promise<any>;
}) {
  let transaction: any;
  let borrowRecord: any;
  let inventoryUpdated = false;

  const {
    validate,
    applyInventory,
    rollbackInventory,
    createTransaction,
    createBorrowRecord,
    finalizeOrder,
  } = params;

  await validate();

  try {
    await applyInventory();
    inventoryUpdated = true;

    transaction = await createTransaction();
    if (createBorrowRecord) {
      borrowRecord = await createBorrowRecord();
    }

    return await finalizeOrder(transaction, borrowRecord);
  } catch (error) {
    // Keep rollback order exactly like existing services (transaction deletion happens in service itself).
    // inventory rollback is always executed after entity cleanup in calling code.
    if (inventoryUpdated) {
      await rollbackInventory();
    }
    throw error;
  }
}

export function assertNonCompletedOrder(
  orderTypeNormalized: string,
  orderStatus: string,
  expectedType: string,
) {
  if (orderTypeNormalized !== expectedType) {
    throw new AppError(
      `Only ${expectedType} orders can be completed with this endpoint`,
      400,
    );
  }

  if ((orderStatus || "").trim().toLowerCase() === "completed") {
    throw new AppError("Order is already completed", 400);
  }
}
