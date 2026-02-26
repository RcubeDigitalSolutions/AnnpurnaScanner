import API from "./axios";

// LOGIN
export const adminLogin = (data) => API.post("/admin/login", data);

// CREATE ADMIN
export const createAdmin = (data) => API.post("/admin/create-admin", data);

// REFRESH TOKEN (cookie will be sent via withCredentials)
export const refreshToken = () => API.post("/admin/refresh-token");

// LOGOUT
export const adminLogout = () => API.post("/admin/logout");

// GET CURRENT ADMIN
export const getMe = () => API.get('/admin/me');

// GET RESTAURANTS
export const getRestaurants = () => API.get("/admin/restaurants");

// CREATE RESTAURANT
export const createRestaurant = (data) => API.post("/admin/restaurant", data);

// UPDATE RESTAURANT
export const updateRestaurant = (id, data) => API.put(`/admin/restaurant/${id}`, data);

// DELETE RESTAURANT
export const deleteRestaurant = (id) => API.delete(`/admin/restaurant/${id}`);