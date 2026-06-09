function validateBook(req: any) {
  const errors: any[] = [];
  const {
    title,
    isbn,
    authors,
    description,
    contentType,
    category,
    language,
    borrowPrice,
    salePrice,
  } = req.body || {};

  if (!title || typeof title !== "string") {
    errors.push({ field: "title", message: "title is required" });
  }

  if (!Array.isArray(authors) || authors.length === 0) {
    errors.push({
      field: "authors",
      message: "authors must be a non-empty array of strings",
    });
  }

  if (isbn !== undefined && typeof isbn !== "string") {
    errors.push({ field: "isbn", message: "isbn must be a string" });
  }

  if (description !== undefined && typeof description !== "string") {
    errors.push({ field: "description", message: "description must be a string" });
  }

  if (contentType !== undefined && typeof contentType !== "string") {
    errors.push({
      field: "contentType",
      message: "contentType must be a string",
    });
  }

  if (category !== undefined && typeof category !== "string") {
    errors.push({ field: "category", message: "category must be a string" });
  }

  if (language !== undefined && typeof language !== "string") {
    errors.push({ field: "language", message: "language must be a string" });
  }

  if (borrowPrice !== undefined && Number.isNaN(Number(borrowPrice))) {
    errors.push({
      field: "borrowPrice",
      message: "borrowPrice must be a number",
    });
  }

  if (salePrice !== undefined && Number.isNaN(Number(salePrice))) {
    errors.push({
      field: "salePrice",
      message: "salePrice must be a number",
    });
  }

  return errors;
}

module.exports = { validateBook };

export { validateBook };
export default { validateBook };
