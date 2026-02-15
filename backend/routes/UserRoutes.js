const express = require('express');
const router = express.Router();
const UserController = require("../controllers/UserController");

//get all restaurants
router.get("/restaurants", UserController.getAllRestaurants);
//get menu items by category
router.get("/menu-items/category/:categoryId", UserController.getMenuItemsByCategory);  
//get menu items sorted by category
router.get("/menu-items/sorted", UserController.getMenuItemsSortedByCategory);

module.exports = router;