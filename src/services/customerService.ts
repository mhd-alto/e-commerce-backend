const CustomerMod = require("../models/Customer");
const Customer = CustomerMod?.default ?? CustomerMod;
const AppErrorMod = require("../utils/AppError");
const AppError = AppErrorMod?.AppError ?? AppErrorMod?.default ?? AppErrorMod;

function ensureCustomerExists(customer: any) {
  if (!customer) {
    throw new AppError("Customer not found", 404);
  }

  return customer;
}

function normalizeCustomerField(value: any) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}

async function createCustomer(data: any) {
  const fullName = normalizeCustomerField(data?.fullName);
  const phone = normalizeCustomerField(data?.phone);
  const address = normalizeCustomerField(data?.address);

  const existingCustomer = await Customer.findOne({
    fullName,
    phone,
    address,
  });

  if (existingCustomer) {
    return existingCustomer;
  }

  return Customer.create({
    ...data,
    fullName,
    phone,
    address,
  });
}

async function getCustomers() {
  return Customer.find().sort({ createdAt: -1 });
}

async function getCustomerById(id: any) {
  return ensureCustomerExists(await Customer.findById(id));
}

async function updateCustomer(id: any, data: any) {
  const customer = await Customer.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  return ensureCustomerExists(customer);
}

async function deleteCustomer(id: any) {
  ensureCustomerExists(await Customer.findByIdAndDelete(id));
  return { deleted: true };
}

module.exports = {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};

export {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};

export default {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};
