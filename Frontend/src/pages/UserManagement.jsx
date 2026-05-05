import { useEffect, useState } from "react";
import API from "../api/api";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data.data);
    } catch (err) {
      console.error("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">

     
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Users 👥
        </h1>
        <span className="text-sm text-gray-500">
          Total: {users.length}
        </span>
      </div>

      
      {loading && (
        <div className="flex justify-center mt-10">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      
      {!loading && users.length === 0 && (
        <p className="text-center text-gray-500">
          No users found 🚀
        </p>
      )}

      
      {!loading && users.length > 0 && (
        <div className="bg-white shadow rounded-xl overflow-hidden">

         
          <div className="grid grid-cols-3 bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-600">
            <span>Name</span>
            <span>Email</span>
            <span className="text-right">Role</span>
          </div>

          
          {users.map((user) => (
            <div
              key={user._id}
              className="grid grid-cols-3 px-4 py-3 border-t items-center hover:bg-gray-50 transition"
            >
              
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-semibold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-gray-800">
                  {user.name}
                </span>
              </div>

              
              <span className="text-sm text-gray-500">
                {user.email}
              </span>

              
              <div className="text-right">
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    user.role === "admin"
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {user.role}
                </span>
              </div>
            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default UserManagement;