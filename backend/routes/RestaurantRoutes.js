const express = require('express');
const router = express.Router();
const RestaurantController = require('../controllers/RestaurantContoller');
const { verifyAdmin, verifyRestaurant, verifyRestaurantStatus } = require('../middleware/auth');

// Restaurant login
router.post('/login', RestaurantController.login);
// refresh token
router.post('/refresh-token', RestaurantController.refreshToken);
// logout
router.post('/logout', RestaurantController.logout);
// current restaurant
router.get('/me', verifyRestaurant, verifyRestaurantStatus, RestaurantController.me);
// Menu items
router.get('/menu', verifyRestaurant, verifyRestaurantStatus, RestaurantController.getMenuItems);
router.post('/menu', verifyRestaurant, verifyRestaurantStatus, RestaurantController.createMenuItem);
router.put('/menu/:id', verifyRestaurant, verifyRestaurantStatus, RestaurantController.updateMenuItem);
router.delete('/menu/:id', verifyRestaurant, verifyRestaurantStatus, RestaurantController.deleteMenuItem);
// restaurant-create category
router.post('/categories', verifyRestaurant, verifyRestaurantStatus, RestaurantController.createCategory);
// Get all categories
router.get('/categories', verifyAdmin, RestaurantController.getCategories);
// Categories for restaurants (list)
router.get('/categories/list', verifyRestaurant, verifyRestaurantStatus, RestaurantController.getCategories);
// Update category
router.put('/categories/:id', verifyAdmin, RestaurantController.updateCategory);
// Delete category
router.delete('/categories/:id', verifyAdmin, RestaurantController.deleteCategory);

// Order endpoints (restaurant dashboard)
router.get('/orders', verifyRestaurant, verifyRestaurantStatus, RestaurantController.getOrders);
router.put('/orders/:id/status', verifyRestaurant, verifyRestaurantStatus, RestaurantController.updateOrderStatus);

// dashboard summary
router.get('/dashboard', verifyRestaurant, verifyRestaurantStatus, RestaurantController.getDashboard);

// Table endpoints (floor plan management)
router.get('/tables', verifyRestaurant, verifyRestaurantStatus, RestaurantController.getTables);
router.post('/tables', verifyRestaurant, verifyRestaurantStatus, RestaurantController.createTable);
router.put('/tables/:id', verifyRestaurant, verifyRestaurantStatus, RestaurantController.updateTable);
router.delete('/tables/:id', verifyRestaurant, verifyRestaurantStatus, RestaurantController.deleteTable);

module.exports = router;
