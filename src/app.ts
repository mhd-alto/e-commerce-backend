import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";

dotenv.config();

const app: Application = express();
const PORT = Number(process.env.PORT) || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: "API is running",
  });
});

// Start server
async function startServer() {
  // Connect DB if configured, but always start the server.
  try {
    await connectDB();
  } catch (err) {
    console.warn("Continuing without DB connection.", err);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
