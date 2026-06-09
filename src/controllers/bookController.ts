const { catchAsync } = require("../utils/catchAsync");
const bookService = require("../services/bookService");

const createBook = catchAsync(async (req: any, res: any) => {
  const result = await bookService.createBook(req.body);
  res.status(201).json(result);
});

const getBooks = catchAsync(async (req: any, res: any) => {
  const books = await bookService.getBooks(req.query);
  res.json(books);
});

const getBookById = catchAsync(async (req: any, res: any) => {
  const book = await bookService.getBookById(req.params.id);
  res.json(book);
});

const updateBook = catchAsync(async (req: any, res: any) => {
  const updated = await bookService.updateBook(req.params.id, req.body);
  res.json(updated);
});

const deleteBook = catchAsync(async (req: any, res: any) => {
  const deleted = await bookService.deleteBook(req.params.id, req.body);
  res.json(deleted);
});

module.exports = {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
};

export {};
