import { seedData } from "./seedData";

async function main() {
  const { connectDB } = require("./config/database");

  try {
    await connectDB();
    await seedData();
    // eslint-disable-next-line no-console
    console.log("Seed completed");
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.error("Seed failed:", e?.message || e);
    process.exit(1);
  } finally {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mongoose = require("mongoose");
    try {
      await mongoose.connection.close();
    } catch {
      // ignore
    }
  }
}

main();
