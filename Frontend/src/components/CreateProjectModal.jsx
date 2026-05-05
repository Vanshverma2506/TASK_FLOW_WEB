import { useState } from "react";
import API from "../api/api";

const CreateProjectModal = ({ close }) => {
  const [title, setTitle] = useState("");

  const handleCreate = async () => {
    await API.post("/projects", { title });
    close();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-6 rounded w-80 space-y-4">
        <h2 className="font-bold">Create Project</h2>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Project name"
          className="w-full border p-2 rounded"
        />

        <div className="flex gap-2">
          <button onClick={handleCreate} className="bg-blue-600 text-white px-3 py-1 rounded">
            Create
          </button>

          <button onClick={close} className="bg-gray-300 px-3 py-1 rounded">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;