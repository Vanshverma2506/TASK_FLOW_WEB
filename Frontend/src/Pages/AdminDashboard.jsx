import { useEffect, useState } from "react";
import API from "../api/api";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ tasks: 0, projects: 0, users: 0 });
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);

  const [taskLoading, setTaskLoading] = useState(false);
  const [projectLoading, setProjectLoading] = useState(false);

  const [taskError, setTaskError] = useState("");
  const [projectError, setProjectError] = useState("");

  const [taskForm, setTaskForm] = useState({
    title: "",
    assignedTo: "",
    project: "",
    priority: "medium",
    deadline: "",
  });

  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    members: [],
  });

  
  const fetchData = async () => {
    try {
      const [taskRes, projectRes, userRes] = await Promise.all([
        API.get("/tasks"),
        API.get("/projects"),
        API.get("/users"),
      ]);

      setStats({
        tasks: taskRes.data.data.length,
        projects: projectRes.data.data.length,
        users: userRes.data.data.length,
      });

      setUsers(userRes.data.data);
      setProjects(projectRes.data.data);
    } catch {
      toast.error("Failed to load dashboard ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  
  const createTask = async () => {
    if (!taskForm.title || !taskForm.assignedTo || !taskForm.project) {
      return setTaskError("All fields required");
    }

    try {
      setTaskLoading(true);
      setTaskError("");

      await API.post("/tasks", taskForm);

      toast.success("Task assigned ✅");

      setShowTaskModal(false);
      setTaskForm({
        title: "",
        assignedTo: "",
        project: "",
        priority: "medium",
        deadline: "",
      });

      fetchData();
    } catch {
      toast.error("Failed ❌");
    } finally {
      setTaskLoading(false);
    }
  };

  
  const createProject = async () => {
    if (!projectForm.title) {
      return setProjectError("Title required");
    }

    try {
      setProjectLoading(true);
      setProjectError("");

      await API.post("/projects", projectForm);

      toast.success("Project created 🚀");

      setShowProjectModal(false);
      setProjectForm({ title: "", description: "", members: [] });

      fetchData();
    } catch {
      toast.error("Failed ❌");
    } finally {
      setProjectLoading(false);
    }
  };

  
  const toggleMember = (id) => {
    setProjectForm((prev) => ({
      ...prev,
      members: prev.members.includes(id)
        ? prev.members.filter((m) => m !== id)
        : [...prev.members, id],
    }));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Panel 👑</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Tasks", value: stats.tasks },
          { label: "Projects", value: stats.projects },
          { label: "Users", value: stats.users },
        ].map((s, i) => (
          <div key={i} className="bg-white p-5 rounded-xl shadow">
            <p className="text-gray-500">{s.label}</p>
            <h2 className="text-2xl font-bold">
              {loading ? "--" : s.value}
            </h2>
          </div>
        ))}
      </div>

     
      <div className="bg-white p-5 rounded-xl shadow space-y-3">
        <h2 className="font-semibold">Quick Actions</h2>

        <div className="flex gap-3">
          <button
            onClick={() => setShowTaskModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            + Assign Task
          </button>

          <button
            onClick={() => setShowProjectModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Create Project
          </button>
        </div>
      </div>

      
      {showTaskModal && (
        <div
          className="fixed inset-0 bg-black/40 flex justify-center items-center"
          onClick={() => setShowTaskModal(false)}
        >
          <div
            className="bg-white p-6 rounded-xl w-96 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Assign Task</h2>

            {taskError && (
              <div className="text-red-500 text-sm">{taskError}</div>
            )}

            <input
              placeholder="Title"
              className="border p-2 w-full"
              value={taskForm.title}
              onChange={(e) =>
                setTaskForm({ ...taskForm, title: e.target.value })
              }
            />

            <select
              className="border p-2 w-full"
              value={taskForm.assignedTo}
              onChange={(e) =>
                setTaskForm({ ...taskForm, assignedTo: e.target.value })
              }
            >
              <option value="">User</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </select>

            <select
              className="border p-2 w-full"
              value={taskForm.project}
              onChange={(e) =>
                setTaskForm({ ...taskForm, project: e.target.value })
              }
            >
              <option value="">Project</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.title}
                </option>
              ))}
            </select>

            <input
              type="date"
              className="border p-2 w-full"
              value={taskForm.deadline}
              onChange={(e) =>
                setTaskForm({ ...taskForm, deadline: e.target.value })
              }
            />

            <button
              onClick={createTask}
              disabled={taskLoading}
              className="bg-green-600 text-white w-full py-2 rounded"
            >
              {taskLoading ? "Assigning..." : "Assign"}
            </button>
          </div>
        </div>
      )}

     
      {showProjectModal && (
        <div
          className="fixed inset-0 bg-black/40 flex justify-center items-center"
          onClick={() => setShowProjectModal(false)}
        >
          <div
            className="bg-white p-6 rounded-xl w-96 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Create Project</h2>

            {projectError && (
              <div className="text-red-500 text-sm">
                {projectError}
              </div>
            )}

            <input
              placeholder="Title"
              className="border p-2 w-full"
              value={projectForm.title}
              onChange={(e) =>
                setProjectForm({
                  ...projectForm,
                  title: e.target.value,
                })
              }
            />

            <textarea
              placeholder="Description"
              className="border p-2 w-full"
              value={projectForm.description}
              onChange={(e) =>
                setProjectForm({
                  ...projectForm,
                  description: e.target.value,
                })
              }
            />

           
            <div className="flex flex-wrap gap-2">
              {users.map((u) => (
                <button
                  key={u._id}
                  onClick={() => toggleMember(u._id)}
                  className={`px-2 py-1 rounded text-xs ${
                    projectForm.members.includes(u._id)
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {u.name}
                </button>
              ))}
            </div>

            <button
              onClick={createProject}
              disabled={projectLoading}
              className="bg-blue-600 text-white w-full py-2 rounded"
            >
              {projectLoading ? "Creating..." : "Create"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;