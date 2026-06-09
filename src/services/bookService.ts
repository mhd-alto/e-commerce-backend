const BookMod = require("../models/Book");
const Book = BookMod?.default ?? BookMod;
const inventoryService = require("./inventoryService");
const AppErrorMod = require("../utils/AppError");
const AppError = AppErrorMod?.AppError ?? AppErrorMod?.default ?? AppErrorMod;

type BookFilters = {
  search?: unknown;
  contentType?: unknown;
  category?: unknown;
  author?: unknown;
};

function getQueryString(value: unknown): string | undefined {
  const rawValue = Array.isArray(value) ? value[0] : value;

  if (typeof rawValue !== "string") {
    return undefined;
  }

  const trimmedValue = rawValue.trim();
  return trimmedValue.length ? trimmedValue : undefined;
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function createContainsRegex(value: string) {
  return new RegExp(escapeRegex(value), "i");
}

function createExactRegex(value: string) {
  return new RegExp(`^${escapeRegex(value)}$`, "i");
}

function buildBookQuery(filters: BookFilters = {}) {
  const search = getQueryString(filters.search);
  const contentType = getQueryString(filters.contentType);
  const category = getQueryString(filters.category);
  const author = getQueryString(filters.author);

  const query: any = {};

  if (contentType) {
    query.contentType = createExactRegex(contentType);
  }

  if (category) {
    query.category = createExactRegex(category);
  }

  if (author) {
    query.authors = { $in: [createContainsRegex(author)] };
  }

  if (search) {
    const searchRegex = createContainsRegex(search);
    query.$or = [
      { title: searchRegex },
      { description: searchRegex },
      { isbn: searchRegex },
      { authors: { $in: [searchRegex] } },
    ];
  }

  return query;
}

function getInventoryQuantity(data: any) {
  const value = data?.quantity ?? data?.totalCopies ?? 0;
  const quantity = Number(value);

  return Number.isFinite(quantity) ? quantity : 0;
}

function ensureBookExists(book: any) {
  if (!book) {
    throw new AppError("Book not found", 404);
  }

  return book;
}

async function createBook(data: any) {
  const book = await Book.create(data);
  const quantity = getInventoryQuantity(data);
  const inventory = await inventoryService.upsertInventory({
    bookId: book._id,
    totalCopies: quantity,
    availableCopies: quantity,
  });

  return { book, inventory };
}

async function getBooks(filters: BookFilters = {}) {
  const books = await Book.find(buildBookQuery(filters)).sort({
    createdAt: -1,
  });

  const results = await Promise.all(
    books.map(async (book: any) => {
      const inventory = await inventoryService.getInventoryByBookId(book._id);

      const availableCopies = Number(inventory.availableCopies || 0);
      const minCopiesForBorrowing = Number(
        inventory.minCopiesForBorrowing || 0,
      );
      const canBuy = availableCopies > 0;
      const canBorrow = availableCopies > minCopiesForBorrowing;
      const lowStock = availableCopies >minCopiesForBorrowing && availableCopies <= minCopiesForBorrowing + 3; // Example threshold for low stock

      return {
        ...(book.toObject?.() ?? book),
        inventory: {
          availableCopies,
          canBuy,
          canBorrow,
          lowStock,
        },
      };
    }),
  );

  return results;
}

async function getBookById(id: any) {
  return ensureBookExists(await Book.findById(id));
}

async function updateBook(id: any, data: any) {
  const book = await Book.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  return ensureBookExists(book);
}

async function deleteBook(id: any, data: any = {}) {
  const book = ensureBookExists(await Book.findById(id));
  const inventoryUpdate = await inventoryService.removeBookCopies(
    book._id,
    data?.quantity,
  );

  if (!inventoryUpdate.allCopiesRemoved) {
    return {
      deleted: false,
      book,
      inventory: inventoryUpdate.inventory,
      removedQuantity: inventoryUpdate.removedQuantity,
    };
  }

  await Book.findByIdAndDelete(book._id);

  return {
    deleted: true,
    removedQuantity: inventoryUpdate.removedQuantity,
  };
}

module.exports = { createBook, getBooks, getBookById, updateBook, deleteBook };

export { createBook, getBooks, getBookById, updateBook, deleteBook };
export default { createBook, getBooks, getBookById, updateBook, deleteBook };
