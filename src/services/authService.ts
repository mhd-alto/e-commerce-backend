import bcrypt = require("bcrypt");
import jwt from "jsonwebtoken";
import Users from "../models/usersModel";

export class AuthService {
  login = async (email: string, password: string) => {
    try {
      const user = Users.find((u: any) => u.email === email);
      if (!user) {
        return { success: false, error: "User not found" };
      }
      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        return { success: false, error: "Invalid credentials" };
      }
      const JWT_SECRET = process.env.JWT_SECRET;
      if (!JWT_SECRET) throw new Error("JWT_SECRET is not set in .env");
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: "1h" },
      );
      return { success: true, token };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: message };
    }
  };
}
