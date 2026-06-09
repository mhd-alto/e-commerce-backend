function validateInventory(req: any) {
  const errors: any[] = [];
  const {
    bookId,
    totalCopies,
    availableCopies,
    borrowedCopies,
    soldCopies,
    minCopiesForBorrowing,
  } = req.body || {};

  if (!bookId) {
    errors.push({ field: "bookId", message: "bookId is required" });
  }

  if (totalCopies !== undefined && Number.isNaN(Number(totalCopies))) {
    errors.push({ field: "totalCopies", message: "totalCopies must be a number" });
  }

  if (availableCopies !== undefined && Number.isNaN(Number(availableCopies))) {
    errors.push({
      field: "availableCopies",
      message: "availableCopies must be a number",
    });
  }

  if (borrowedCopies !== undefined && Number.isNaN(Number(borrowedCopies))) {
    errors.push({
      field: "borrowedCopies",
      message: "borrowedCopies must be a number",
    });
  }

  if (soldCopies !== undefined && Number.isNaN(Number(soldCopies))) {
    errors.push({
      field: "soldCopies",
      message: "soldCopies must be a number",
    });
  }

  if (
    minCopiesForBorrowing !== undefined &&
    Number.isNaN(Number(minCopiesForBorrowing))
  ) {
    errors.push({
      field: "minCopiesForBorrowing",
      message: "minCopiesForBorrowing must be a number",
    });
  }

  return errors;
}

module.exports = { validateInventory };

export { validateInventory };
export default { validateInventory };
