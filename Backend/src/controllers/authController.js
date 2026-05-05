import UserModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing");
  }

  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES || "7d",
    }
  );
};


const sendResponse = (res, statusCode, success, message, data = null) => {
  return res.status(statusCode).json({
    success,
    message,
    data,
  });
};

export const registerUser = async (req, res) => {
  try {
    let { name, email, password, role } = req.body;

   
    name = name?.trim();
    email = email?.toLowerCase().trim();
    password = password?.trim();

    
    if (!name || !email || !password) {
      return sendResponse(res, 400, false, "All fields are required");
    }

    if (name.length < 3) {
      return sendResponse(res, 400, false, "Name must be at least 3 characters");
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return sendResponse(res, 400, false, "Invalid email format");
    }

    if (password.length < 6) {
      return sendResponse(res, 400, false, "Password must be at least 6 characters");
    }

    if (role && !["admin", "member"].includes(role)) {
      return sendResponse(res, 400, false, "Invalid role");
    }

    
    const userExists = await UserModel.findOne({ email }).lean();
    if (userExists) {
      return sendResponse(res, 400, false, "User already exists");
    }

    
    const hashedPassword = await bcrypt.hash(password, 12);

   
    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      role: role || "member",
    });

    const token = generateToken(user);

    return sendResponse(res, 201, true, "User registered successfully", {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
  
    if (error.code === 11000) {
      return sendResponse(res, 400, false, "Email already exists");
    }

    console.error("Register Error:", error.message);
    return sendResponse(res, 500, false, "Something went wrong");
  }
};

export const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    
    email = email?.toLowerCase().trim();
    password = password?.trim();

    if (!email || !password) {
      return sendResponse(res, 400, false, "Email and password are required");
    }

    const user = await UserModel.findOne({ email }).select("+password");

    if (!user) {
      return sendResponse(res, 400, false, "Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return sendResponse(res, 400, false, "Invalid credentials");
    }

   
    user.password = undefined;

    const token = generateToken(user);

    return sendResponse(res, 200, true, "Login successful", {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("Login Error:", error.message);
    return sendResponse(res, 500, false, "Something went wrong");
  }
};