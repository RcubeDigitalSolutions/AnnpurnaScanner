const express = require("express");
const router = express.Router();
module.exports = router;
const AdminController = require("../controllers/AdminController");
// Admin Login
router.post("/login", AdminController.login);
// Restaurant Registration
router.post("/register-restaurant", AdminController.registerRestaurant);
//update restaurant 
router.put("/update-restaurant/:id", AdminController.updateRestaurant);
//delete restaurant
router.delete("/delete-restaurant/:id", AdminController.deleteRestaurant);
//get all restaurant
router.get("/restaurants", AdminController.getAllRestaurants);

