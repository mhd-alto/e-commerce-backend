const { catchAsync } = require("../utils/catchAsync");
const transactionService = require("../services/transactionService");

const getTransactions = catchAsync(async (req: any, res: any) => {
  const txs = await transactionService.getTransactions(req.query);
  res.json(txs);
});

const getTransactionByOrderId = catchAsync(async (req: any, res: any) => {
  const tx = await transactionService.getTransactionByOrderId(
    req.params.orderId,
  );
  res.json(tx);
});

module.exports = {
  getTransactions,
  getTransactionByOrderId,
};

export {};
