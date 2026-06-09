const mongoose = require("mongoose");
const { getEnv } = require("./dist/src/config/env.js");
(async () => {
  const { MONGODB_URI } = getEnv();
  await mongoose.connect(MONGODB_URI);
  const Order = mongoose.model("Order", new mongoose.Schema({}));
  const orders = await Order.find().limit(5).lean();
  console.log(JSON.stringify(orders, null, 2));
  await mongoose.disconnect();
})().catch(err => { console.error(err); process.exit(1); });
