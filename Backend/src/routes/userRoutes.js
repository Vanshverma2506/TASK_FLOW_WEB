import express from "express";
import UserModel from "../models/userModel.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const users = await UserModel.find().select("-password");

    res.json({
      success: true,
      data: users,
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

export default router;