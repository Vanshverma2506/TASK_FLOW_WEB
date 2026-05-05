import { useEffect, useState, useContext } from "react";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import CreateTaskModal from "../components/CreateTaskModal";

const Tasks = () => {
  const { user } = useContext(AuthContext);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);

  const [page, setPage] = useState(1);
  const limit = 6;

  
  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  
  const updateStatus = async (id, status) => {
    try {
      await API.put(`/tasks/${id}`, { status });

      setTasks((prev) =>
        prev.map((t) =>
          t._id === id ? { ...t, status } : t
        )
      );
    } catch (err) {
      console.error("Update failed");
    }
  };

 
  const filtered =
    filter === "all"
      ? tasks
      : tasks.filter((t) => t.status === filter);

  const paginated = filtered.slice(
    (page - 1) * limit,
    page * limit
  );

  return (
    <div className="space-y-6">

     
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          Tasks
        </h1>

        <select
          onChange={(e) => setFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>

        {user?.role === "admin" && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
          >
            + Create Task
          </button>
        )}
      </div>

     
      {loading && (
        <div className="flex justify-center mt-10">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      
      {!loading && paginated.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No tasks found 🚀
        </p>
      )}

      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {paginated.map((task) => (
          <div
            key={task._id}
            className="bg-white p-5 rounded-xl shadow hover:shadow-md transition space-y-3"
          >
            <h3 className="font-semibold text-lg">
              {task.title}
            </h3>

            <p className="text-sm text-gray-500">
              {task.description || "No description"}
            </p>

            <div className="flex justify-between items-center">

             
              <span
                className={`text-xs px-2 py-1 rounded ${
                  task.status === "completed"
                    ? "bg-green-100 text-green-600"
                    : task.status === "in-progress"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}
              >
                {task.status}
              </span>

              
              {task.assignedTo?._id?.toString() === user?.id?.toString() && (
                <select
                  value={task.status}
                  onChange={(e) =>
                    updateStatus(task._id, e.target.value)
                  }
                  className="text-xs border rounded px-1"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              )}
            </div>

            
            <div className="text-xs text-gray-400">
              Project: {task.project?.title || "N/A"}
            </div>

          </div>
        ))}

      </div>

      
      <div className="flex justify-center gap-3 mt-4">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="font-medium">{page}</span>

        <button
          onClick={() => setPage(page + 1)}
          disabled={page * limit >= filtered.length}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      
      {showModal && (
        <CreateTaskModal
          close={() => setShowModal(false)}
          refresh={fetchTasks}
        />
      )}

    </div>
  );
};

export default Tasks;