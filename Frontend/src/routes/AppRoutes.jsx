import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Tasks from "../pages/Tasks";
import Projects from "../pages/Projects";
import AdminDashboard from "../pages/AdminDashboard";
import UserManagement from "../pages/UserManagement";

import ProtectedRoute from "../components/ProtectedRoute";
import AdminRoute from "../components/AdminRoute";
import Layout from "../components/Layout";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/projects" element={<Projects />} />
        </Route>

       
        <Route
          element={
            <AdminRoute>
              <Layout />
            </AdminRoute>
          }
        >
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/users" element={<UserManagement />} />
        </Route>

       
        <Route
          path="*"
          element={
            <div className="flex items-center justify-center h-screen text-xl font-semibold">
              404 - Page Not Found
            </div>
          }
        />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;