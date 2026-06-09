import { register , addAdmin } from "../services/authService";
import { Request, Response } from "express";

export async function registerUser(req: Request, res: Response) {
  const userRegistered = await register(req.body);
  return res
    .status(201)
    .json({ ...userRegistered, message: "user registered successfully" });
}


export async function registerAdmin(req: Request, res: Response) {
  const userRegistered = await addAdmin(req.body);
  return res
    .status(201)
    .json({ ...userRegistered, message: "admin added successfully" });
}
