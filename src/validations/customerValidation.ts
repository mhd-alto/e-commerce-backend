function validateCustomer(req: any) {
  const errors: any[] = [];
  const { fullName, phone, address } = req.body || {};

  if (!fullName || typeof fullName !== "string") {
    errors.push({ field: "fullName", message: "fullName is required" });
  }

  if (!phone || typeof phone !== "string") {
    errors.push({ field: "phone", message: "phone is required" });
  }

  if (address !== undefined && typeof address !== "string") {
    errors.push({ field: "address", message: "address must be a string" });
  }

  return errors;
}

module.exports = { validateCustomer };

export { validateCustomer };
export default { validateCustomer };
