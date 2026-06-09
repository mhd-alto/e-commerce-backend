import bcrypt = require("bcrypt");
import jwt from "jsonwebtoken";
import Users from "../models/usersModel";

interface Users {
  email: string;
  password: string;
  role: string;
}

export class AuthService {
  login = async (email: string, password: string) => {
    try {
      const user = Users.find((u: any) => u.email === email);
      if (!user) {
        return { success: false, error: "User not found" };
      }
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return { success: false, error: "Invalid credentials" };
      }
      return jwt.sign(
        {
             id: user._id,
             role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: message };
    }
  };
}
