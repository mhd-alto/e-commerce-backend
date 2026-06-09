import { createCustomer } from "./customerService";

const ADMIN_CUSTOMER_ID = "507f191e810c19729de860ea";

export async function ensureAdminCustomerOnStartup(): Promise<void> {
  const CustomerMod = require("../models/Customer");
  const Customer = CustomerMod?.default ?? CustomerMod;

  const existing = await Customer.findById(ADMIN_CUSTOMER_ID);
  if (existing) return;

  await createCustomer({
    _id: ADMIN_CUSTOMER_ID,
    fullName: "admin",
    phone: "admin",
    address: "admin",
  });
}