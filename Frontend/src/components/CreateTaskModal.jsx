import { useEffect, useState } from "react";
import API from "../api/api";
import toast from "react-hot-toast";

const CreateTaskModal = ({ close, refresh }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    project: "",
  });

  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const load = async () => {
      const u = await API.get("/users");
      const p = await API.get("/projects");
      setUsers(u.data.data);
      setProjects(p.data.data);
    };
    load();
  }, []);

  const handleCreate = async () => {
    if (!form.title) return toast.error("Title required");

    try {
      await API.post("/tasks", form);
      toast.success("Task created");
      refresh();
      close();
    } catch {
      toast.error("Error creating task");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96 space-y-3">

        <h2 className="font-semibold text-lg">Create Task</h2>

        <input
          placeholder="Title"
          className="border p-2 w-full rounded"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          placeholder="Description"
          className="border p-2 w-full rounded"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <select
          className="border p-2 w-full rounded"
          onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
        >
          <option value="">Assign User</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name}
            </option>
          ))}
        </select>

        <select
          className="border p-2 w-full rounded"
          onChange={(e) => setForm({ ...form, project: e.target.value })}
        >
          <option value="">Select Project</option>
          {projects.map((p) => (
            <option key={p._id} value={p._id}>
              {p.title}
            </option>
          ))}
        </select>

        <div className="flex gap-2">
          <button
            onClick={handleCreate}
            className="bg-purple-600 text-white px-3 py-1 rounded"
          >
            Create
          </button>

          <button
            onClick={close}
            className="bg-gray-200 px-3 py-1 rounded"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};

export default CreateTaskModal;