import axios from "axios";

const DEFAULT_API = "http://localhost:5000/api";
const envUrl = import.meta.env.VITE_API_URL;
let BASE_URL = envUrl || DEFAULT_API;

// If dev server is running (vite default port 5173) and VITE_API_URL was set to '/api',
// prefer the local backend to avoid requests hitting the Vite dev server without a proxy.
if (
  typeof window !== 'undefined' &&
  window.location.hostname === 'localhost' &&
  (window.location.port === '5173' || window.location.port === '5174') &&
  envUrl === '/api'
) {
  BASE_URL = DEFAULT_API;
}

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers = req.headers || {};
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

API.interceptors.response.use(
  (res) => {
    try {
      if (res && res.data && res.data.message) {
        const ev = new CustomEvent('app-toast', { detail: { message: res.data.message, type: 'success' } });
        window.dispatchEvent(ev);
      }
    } catch (e) {}
    return res;
  },
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    originalRequest._retry = originalRequest._retry || 0;

    if (error.response && error.response.status === 401 && originalRequest._retry < 1) {
      originalRequest._retry += 1;
      try {
        const res = await API.post('/restaurants/refresh-token');
        const newToken = res.data.accessToken;
        if (newToken) {
          localStorage.setItem('token', newToken);
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return API(originalRequest);
        }
      } catch (err) {
        localStorage.removeItem('token');
        try { if (typeof window !== 'undefined') window.location.href = '/login'; } catch(e){}
      }
    }

    // show error toast
    try {
      const message = error?.response?.data?.message || error.message || 'Request failed';
      const ev = new CustomEvent('app-toast', { detail: { message, type: 'error' } });
      window.dispatchEvent(ev);
      // if server indicates plan expired, open plan-expired modal
      if (error.response && error.response.status === 403) {
        try {
          const ev2 = new CustomEvent('app-restaurant-disabled', { detail: { message } });
          window.dispatchEvent(ev2);
        } catch (e) {}
      }
    } catch (e) {}

    return Promise.reject(error);
  }
);

export default API;
