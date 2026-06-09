const { catchAsync } = require("../utils/catchAsync");
const orderService = require("../services/orderService");

const createOrder = catchAsync(async (req: any, res: any) => {
  const order = await orderService.createOrder(req.body);
  res.status(201).json(order);
});

const getOrders = catchAsync(async (req: any, res: any) => {
  const orders = await orderService.getOrders(req.query);
  res.json(orders);
});

const getOrdersByCustomerId = catchAsync(async (req: any, res: any) => {
  const result = await orderService.getOrdersByCustomerId(
    req.params.customerId,
  );
  res.json(result);
});

const getOrderById = catchAsync(async (req: any, res: any) => {
  const order = await orderService.getOrderById(req.params.id);
  res.json(order);
});

const rejectOrder = catchAsync(async (req: any, res: any) => {
  const updated = await orderService.rejectOrder(req.params.id);
  res.json(updated);
});

const completeBuy = catchAsync(async (req: any, res: any) => {
  const result = await orderService.completeBuy(
    req.params.buyOrderId,
    req.body,
  );
  res.status(201).json(result);
});

const completeBorrow = catchAsync(async (req: any, res: any) => {
  const result = await orderService.completeBorrow(
    req.params.borrowOrderId,
    req.body,
  );
  res.status(201).json(result);
});

module.exports = {
  createOrder,
  getOrders,
  getOrdersByCustomerId,
  getOrderById,
  rejectOrder,
  completeBuy,
  completeBorrow,
};

export {};
