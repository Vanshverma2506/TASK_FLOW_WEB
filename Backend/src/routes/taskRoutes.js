import express from "express";

import {
  createTask,
  getTasks,
  updateTaskStatus,
  getTaskStats
} from "../controllers/taskController.js";

import TaskModel from "../models/taskModel.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/stats", protect, async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "member") {
      filter.assignedTo = req.user.id;
    }

    const total = await TaskModel.countDocuments(filter);

    const completed = await TaskModel.countDocuments({
      ...filter,
      status: "completed",
    });

    const pending = await TaskModel.countDocuments({
      ...filter,
      status: "pending",
    });

    res.json({
      success: true,
      data: { total, completed, pending },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});


router.post("/", protect, authorizeRoles("admin"), createTask);


router.get("/", protect, getTasks);


router.put("/:id", protect, updateTaskStatus);
router.get("/stats", protect, getTaskStats);

export default router;