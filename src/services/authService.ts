import User from "../models/usersModel";
import bcrypt from "bcryptjs";
import "dotenv/config";

// دالة التحقق من الإيميل (تم نقلها للأعلى لتجنب مشاكل النطاق)
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

interface RegisterInput {
  fullName?: string;
  email?: string;
  password?: string;
}

export async function register(userData: RegisterInput) {
  const { fullName, email, password } = userData;
  if (!email || !isValidEmail(email)) {
    throw { statusCode: 400, message: "Enter a valid email" };
  }
  if (!password || password.length < 6) {
    throw {
      statusCode: 400,
      message: "Password must be at least 6 characters long",
    };
  }
  if (!fullName || fullName.trim().length === 0) {
    throw { statusCode: 400, message: "Full name is required" };
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw {
      statusCode: 409,
      message: "Email is already registered.",
    };
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      isverified: false,
    });
    const userObj = newUser.toObject();
    const { password: _, ...userWithoutPassword } = userObj;
    return { success: true, data: userWithoutPassword };
  } catch (error: any) {
    throw { statusCode: 500, message: error.message };
  }
}

export async function addAdmin(adminData: RegisterInput) {
  const { fullName, email, password } = adminData;
  if (!email || !isValidEmail(email)) {
    throw { statusCode: 400, message: "Enter a valid email" };
  }
  if (!password || password.length < 6) {
    throw {
      statusCode: 400,
      message: "Password must be at least 6 characters long",
    };
  }
  if (!fullName || fullName.trim().length === 0) {
    throw { statusCode: 400, message: "Full name is required" };
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw {
      statusCode: 409,
      message: "Email is already registered.",
    };
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await User.create({
      fullName,
      email,
      password: hashedPassword,
      isverified: true,
      role: "admin",
    });
    const userObj = newAdmin.toObject();
    const { password: _, ...userWithoutPassword } = userObj;
    return { success: true, data: userWithoutPassword };
  } catch (error: any) {
    throw { statusCode: 500, message: error.message };
  }
}
