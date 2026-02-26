import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
// Attach token from localStorage as Authorization header when available
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers = req.headers || {};
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Response interceptor: try refresh on 401 (refresh returns accessToken JSON)
API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    // give up after 1 retry + refresh attempt
    originalRequest._retry = originalRequest._retry || 0;

    if (error.response && error.response.status === 401 && originalRequest._retry < 1) {
      originalRequest._retry += 1;
      try {
        const res = await API.post('/admin/refresh-token');
        const newToken = res.data.accessToken;
        if (newToken) {
          localStorage.setItem('token', newToken);
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return API(originalRequest);
        }
      } catch (err) {
        // refresh failed; clear token and redirect to login
        localStorage.removeItem('token');
        try {
          if (typeof window !== 'undefined') window.location.href = '/login';
        } catch (e) {}
      }
    }

    return Promise.reject(error);
  }
);

export default API;