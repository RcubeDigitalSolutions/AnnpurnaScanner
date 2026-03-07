const express = require('express');
const router = express.Router();
const UserController = require("../controllers/UserController");

//get all restaurants
router.get("/restaurants", UserController.getAllRestaurants);
// public menu for a specific restaurant
router.get("/restaurants/:restaurantId/menu", UserController.getRestaurantMenu);
// public restaurant info (name, etc.)
router.get("/restaurants/:restaurantId", UserController.getRestaurantInfo);
// generate unique 4-digit order number
router.get("/orders/generate-number", UserController.generateOrderNumber);
// public order status tracking
router.get("/orders/:id", UserController.getOrderById);
//create order (user facing)
router.post("/orders", UserController.createOrder);
//get menu items by category
router.get("/menu-items/category/:categoryId", UserController.getMenuItemsByCategory);  
//get menu items sorted by category
router.get("/menu-items/sorted", UserController.getMenuItemsSortedByCategory);

module.exports = router;