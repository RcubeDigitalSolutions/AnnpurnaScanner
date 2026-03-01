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

// Order endpoints (restaurant side)
export const getOrders = () => API.get('/restaurants/orders');
export const updateOrderStatus = (id, data) => API.put(`/restaurants/orders/${id}/status`, data);

// Table endpoints (floor plan management)
export const getTables = () => API.get('/restaurants/tables');
export const createTable = (data) => API.post('/restaurants/tables', data);
export const updateTable = (id, data) => API.put(`/restaurants/tables/${id}`, data);
export const deleteTable = (id) => API.delete(`/restaurants/tables/${id}`);

// Order endpoints (user side) - mounted on /orders
export const createOrder = (data) => API.post('/orders', data);

// Public menu access for guests
export const getPublicMenu = (restaurantId) => API.get(`/restaurants/${restaurantId}/menu`);
export const getRestaurantInfo = (restaurantId) => API.get(`/restaurants/${restaurantId}`);

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
  getOrders,
  updateOrderStatus,
  getTables,
  createTable,
  updateTable,
  deleteTable,
  createOrder,
  getPublicMenu,
  getRestaurantInfo,
};
