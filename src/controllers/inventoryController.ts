const { catchAsync } = require("../utils/catchAsync");
const inventoryService = require("../services/inventoryService");

const listInventories = catchAsync(async (req: any, res: any) => {
  const inventories = await inventoryService.listInventories();
  res.json(inventories);
});

const getInventoryByBookId = catchAsync(async (req: any, res: any) => {
  const inventory = await inventoryService.getInventoryByBookId(
    req.params.bookId,
  );
  res.json(inventory);
});

module.exports = {
  listInventories,
  getInventoryByBookId,
};

export {};
