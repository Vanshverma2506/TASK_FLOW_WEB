import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

import Authrouter from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import userRoutes from "./routes/userRoutes.js"

const app = express();


app.use(express.json());
app.use(helmet());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://task-flow-web-nj9g.onrender.com"
  ],
  credentials: true
}));
app.use(morgan("dev"));


app.use("/api/auth", Authrouter);
app.use("/api/tasks", taskRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/users", userRoutes)


app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});


app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
});

export default app;