import { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const navLink = (path, label) => (
    <button
      onClick={() => {
        navigate(path);
        setOpen(false);
      }}
      className={`px-3 py-2 rounded-lg text-sm cursor-pointer font-medium transition ${
        location.pathname === path
          ? "bg-purple-600 text-white shadow"
          : "text-gray-600 hover:bg-purple-100"
      }`}
    >
      {label}
    </button>
  );

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">

       
        <h1
          onClick={() => navigate("/dashboard")}
          className="text-xl font-bold bg-linear-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text cursor-pointer"
        >
          TaskFlow
        </h1>

        
        <div className="hidden md:flex items-center gap-2">

          {navLink("/dashboard", "Dashboard")}
          {navLink("/tasks", "Tasks")}
          {navLink("/projects", "Projects")}

          {user?.role === "admin" && navLink("/admin", "Admin")}
          {user?.role === "admin" && navLink("/users", "Users")}

         
          {user && (
            <div className="flex items-center gap-3 ml-4 bg-gray-100 px-3 py-1 rounded-lg">

              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-semibold">
                {user.name?.charAt(0).toUpperCase()}
              </div>

              <div className="leading-tight">
                <p className="text-sm font-medium">{user.name}</p>
                <span className="text-xs text-purple-600">
                  {user.role}
                </span>
              </div>

            </div>
          )}

         
          <button
            onClick={logoutUser}
            className="ml-3 px-3 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
          >
            Logout
          </button>
        </div>

        <button
          className="md:hidden text-2xl text-gray-700"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      
      {open && (
        <div className="md:hidden px-4 pb-4 space-y-2  bg-white border-t">

          {navLink("/dashboard", "Dashboard")}
          {navLink("/tasks", "Tasks")}
          {navLink("/projects", "Projects")}

          {user?.role === "admin" && navLink("/admin", "Admin")}
          {user?.role === "admin" && navLink("/users", "Users")}

          {user && (
            <div className="flex items-center gap-3 mt-3 bg-gray-100 p-2 rounded">

              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm">
                {user.name?.charAt(0).toUpperCase()}
              </div>

              <div>
                <p className="text-sm">{user.name}</p>
                <span className="text-xs text-purple-600">
                  {user.role}
                </span>
              </div>

            </div>
          )}

          <button
            onClick={logoutUser}
            className="w-full mt-3 bg-red-500 text-white py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;