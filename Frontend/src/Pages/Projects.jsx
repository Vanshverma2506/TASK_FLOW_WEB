import { useEffect, useState } from "react";
import API from "../api/api";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null); 

  const fetchProjects = async () => {
    try {
      setError(null);
      const res = await API.get("/projects");
      setProjects(res.data.data);
    } catch (err) {
      setError("Failed to load projects ❌"); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filtered = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">

      
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-800">
          Projects 📁
        </h1>

        <input
          placeholder="Search projects..."
          className="border px-4 py-2 rounded-lg w-64 focus:ring-2 focus:ring-purple-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      
      {error && (
        <div className="bg-red-100 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      
      {loading && (
        <div className="flex justify-center mt-10">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      
      {!loading && !error && filtered.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          <p className="text-lg">No projects found 🚀</p>
          <p className="text-sm">Ask admin to assign you a project</p>
        </div>
      )}

      
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {filtered.map((project) => (
            <div
              key={project._id}
              className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition space-y-3"
            >
              
              <h3 className="text-lg font-semibold text-gray-800">
                {project.title}
              </h3>

              
              <p className="text-sm text-gray-500">
                {project.description || "No description"}
              </p>

             
              <div className="flex items-center gap-2 flex-wrap">
                {project.members?.length > 0 ? (
                  project.members.map((m) => (
                    <div
                      key={m._id}
                      className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-xs"
                    >
                      <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px]">
                        {m.name?.charAt(0).toUpperCase()}
                      </div>
                      <span>{m.name}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-xs text-gray-400">
                    No members
                  </span>
                )}
              </div>

              
              <div className="text-xs text-gray-400">
                Created by: {project.createdBy?.name || "Admin"}
              </div>
            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default Projects;