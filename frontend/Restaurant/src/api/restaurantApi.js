import API from './axios';

export const restaurantLogin = (data) => API.post('/restaurants/login', data);
export const refreshToken = () => API.post('/restaurants/refresh-token');
export const restaurantLogout = () => API.post('/restaurants/logout');
export const getMe = () => API.get('/restaurants/me');
export const getCategories = () => API.get('/restaurants/categories/list');
// Menu endpoints
export const getMenuItems = () => API.get('/restaurants/menu');
export const createMenuItem = (data) => API.post('/restaurants/menu', data);
export const updateMenuItem = (id, data) => API.put(`/restaurants/menu/${id}`, data);
export const deleteMenuItem = (id) => API.delete(`/restaurants/menu/${id}`);
// Category for restaurants
export const createCategory = (data) => API.post('/restaurants/categories', data);

export default {
  restaurantLogin,
  refreshToken,
  restaurantLogout,
  getMe,
  getCategories,
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  createCategory,
};
