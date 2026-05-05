import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      validate: {
        validator: (v) => v.trim().length > 0,
        message: "Title cannot be empty",
      },
    },
    description: {
      type: String,
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);


projectSchema.index({ createdBy: 1, createdAt: -1 });

const ProjectModel = mongoose.model("Project", projectSchema);

export default ProjectModel;