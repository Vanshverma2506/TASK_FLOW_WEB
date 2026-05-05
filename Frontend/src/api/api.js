import axios from "axios";


const API = axios.create({
  baseURL: "https://taskflowweb-production-e48c.up.railway.app/api",
  timeout: 10000, 
  withCredentials: false,
});


API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      
      window.location.href = "/";
    }

  
    if (status >= 500) {
      console.error("Server error:", error.response?.data);
    }

    return Promise.reject(error);
  }
);

export default API;