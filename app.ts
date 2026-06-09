const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const { connectDB } = require("./src/config/database");
const { errorMiddleware } = require("./src/middleware/errorMiddleware");

const apiRoutes = require("./src/routes");

const app = express();

app.use(cors());

app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api", apiRoutes);

app.use(errorMiddleware);

connectDB()
  .then(() =>
    require("./src/services/ensureAdminCustomer").ensureAdminCustomerOnStartup(),
  )
  .catch((err: any) => {
    console.error("Startup seeding failed:", err?.message || err);
  });

module.exports = app;
