import mongoose from "mongoose";
import TaskModel from "../models/taskModel.js";
import UserModel from "../models/userModel.js";
import ProjectModel from "../models/projectModel.js";


const sendResponse = (res, status, success, message, data = null) => {
  return res.status(status).json({ success, message, data });
};


export const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, project, priority, deadline } = req.body;

    if (!title || !assignedTo || !project) {
      return sendResponse(res, 400, false, "Required fields missing");
    }

   
    if (!mongoose.Types.ObjectId.isValid(assignedTo) || !mongoose.Types.ObjectId.isValid(project)) {
      return sendResponse(res, 400, false, "Invalid IDs");
    }

    const user = await UserModel.findById(assignedTo);
    if (!user) {
      return sendResponse(res, 404, false, "Assigned user not found");
    }

    
    const projectData = await ProjectModel.findById(project);
    if (!projectData) {
      return sendResponse(res, 404, false, "Project not found");
    }

    const task = await TaskModel.create({
      title,
      description,
      assignedTo,
      project,
      priority,
       deadline: deadline ? new Date(deadline) : null,
      createdBy: req.user._id,
    });

    return sendResponse(res, 201, true, "Task created", task);

  } catch (error) {
    console.error("Create Task Error:", error.message);
    return sendResponse(res, 500, false, "Something went wrong");
  }
};


export const getTasks = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "member") {
      filter.assignedTo = req.user._id;
    }

    const tasks = await TaskModel.find(filter)
      .populate("assignedTo", "name email")
      .populate("project", "title")
      .sort({ createdAt: -1 }) 
      .lean(); 

    return sendResponse(res, 200, true, "Tasks fetched", tasks);

  } catch (error) {
    console.error("Get Tasks Error:", error.message);
    return sendResponse(res, 500, false, "Something went wrong");
  }
};


export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!["pending", "in-progress", "completed"].includes(status)) {
      return sendResponse(res, 400, false, "Invalid status");
    }

    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, false, "Invalid task ID");
    }

    const task = await TaskModel.findById(id);

    if (!task) {
      return sendResponse(res, 404, false, "Task not found");
    }

   
    if (task.assignedTo.toString() !== req.user._id.toString()) {
      return sendResponse(res, 403, false, "Not allowed");
    }

    task.status = status;
    await task.save();

    return sendResponse(res, 200, true, "Task updated", task);

  } catch (error) {
    console.error("Update Task Error:", error.message);
    return sendResponse(res, 500, false, "Something went wrong");
  }
};

export const getTaskStats = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "member") {
      filter.assignedTo = req.user._id;
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

    const inProgress = await TaskModel.countDocuments({
      ...filter,
      status: "in-progress",
    });

    
    const overdue = await TaskModel.countDocuments({
      ...filter,
      deadline: {
        $exists: true,    
        $ne: null,
        $lt: new Date(),  
      },
      status: { $ne: "completed" }, 
    });

    return res.json({
      success: true,
      data: {
        total,
        completed,
        pending,
        inProgress,
        overdue,
      },
    });

  } catch (error) {
    console.error("Stats Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};