import mongoose from "mongoose";
import ProjectModel from "../models/projectModel.js";


const sendResponse = (res, status, success, message, data = null) => {
  return res.status(status).json({ success, message, data });
};


export const createProject = async (req, res) => {
  try {
    let { title, description, members } = req.body;

   
    title = title?.trim();
    description = description?.trim();

    if (!title) {
      return sendResponse(res, 400, false, "Title required");
    }

    let uniqueMembers = [];
    if (Array.isArray(members)) {
      uniqueMembers = [...new Set(members)];
    }

    
    if (uniqueMembers.some(id => !mongoose.Types.ObjectId.isValid(id))) {
      return sendResponse(res, 400, false, "Invalid member IDs");
    }

    const project = await ProjectModel.create({
      title,
      description,
      members: uniqueMembers,
      createdBy: req.user._id,
    });

    return sendResponse(res, 201, true, "Project created", project);

  } catch (err) {
    console.error("Create Project Error:", err.message);
    return sendResponse(res, 500, false, "Something went wrong");
  }
};


export const getProjects = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "member") {
      filter.members = req.user._id;
    } else {
      filter.createdBy = req.user._id;
    }

    const projects = await ProjectModel.find(filter)
      .populate("members", "name email")
      .sort({ createdAt: -1 }) 
      .lean(); 

    return sendResponse(res, 200, true, "Projects fetched", projects);

  } catch (err) {
    console.error("Get Projects Error:", err.message);
    return sendResponse(res, 500, false, "Something went wrong");
  }
};