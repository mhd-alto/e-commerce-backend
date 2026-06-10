import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
const secretKey = process.env.JWT_SECRET;
export const authMiddleware = (
  req: any,
  res: Response,
  next: NextFunction,
): void | Response => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, secretKey!) 
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(400).json({ message: "Invalid token" });
  }
};
