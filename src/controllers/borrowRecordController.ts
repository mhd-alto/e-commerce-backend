const { catchAsync } = require("../utils/catchAsync");
const borrowRecordService = require("../services/borrowRecordService");

const getBorrowRecords = catchAsync(async (req: any, res: any) => {
  const records = await borrowRecordService.getBorrowRecords(req.query);
  res.json(records);
});

const getBorrowRecordsByBookId = catchAsync(async (req: any, res: any) => {
  const records = await borrowRecordService.getBorrowRecordsByBookId(
    req.params.bookId,
  );
  res.json(records);
});

const getBorrowRecordsByCustomerId = catchAsync(async (req: any, res: any) => {
  const records = await borrowRecordService.getBorrowRecordsByCustomerId(
    req.params.customerId,
  );
  res.json(records);
});

const getBorrowRecordById = catchAsync(async (req: any, res: any) => {
  const record = await borrowRecordService.getBorrowRecordById(req.params.id);
  res.json(record);
});

const returnBook = catchAsync(async (req: any, res: any) => {
  const updated = await borrowRecordService.returnBook(req.params.id, req.body);
  res.json(updated);
});

module.exports = {
  getBorrowRecords,
  getBorrowRecordsByBookId,
  getBorrowRecordsByCustomerId,
  getBorrowRecordById,
  returnBook,
};

export {};
