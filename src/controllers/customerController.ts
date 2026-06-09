const { catchAsync } = require("../utils/catchAsync");
const customerService = require("../services/customerService");

const createCustomer = catchAsync(async (req: any, res: any) => {
  const customer = await customerService.createCustomer(req.body);
  res.status(201).json(customer);
});

const getCustomers = catchAsync(async (req: any, res: any) => {
  const customers = await customerService.getCustomers();
  res.json(customers);
});

const getCustomerById = catchAsync(async (req: any, res: any) => {
  const customer = await customerService.getCustomerById(req.params.id);
  res.json(customer);
});

const updateCustomer = catchAsync(async (req: any, res: any) => {
  const updated = await customerService.updateCustomer(req.params.id, req.body);
  res.json(updated);
});

const deleteCustomer = catchAsync(async (req: any, res: any) => {
  const deleted = await customerService.deleteCustomer(req.params.id);
  res.json(deleted);
});

module.exports = {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};

export {};
