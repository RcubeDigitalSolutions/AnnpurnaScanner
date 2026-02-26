const express = require("express");
const router = express.Router();

const adminController = require("../controllers/AdminController");
const { verifyAdmin } = require("../middleware/auth");

// AUTH ROUTES
router.post("/login", adminController.login);
router.post("/create-admin", adminController.createAdmin);
router.post("/refresh-token", adminController.refreshToken);
router.post("/logout", adminController.logout);
router.get('/me', verifyAdmin, adminController.me);
// Create restaurant (admin only)
router.post('/restaurant', verifyAdmin, adminController.registerRestaurant);
router.get('/restaurants', verifyAdmin, adminController.getAllRestaurants);
router.put('/restaurant/:id', verifyAdmin, adminController.updateRestaurant);
router.delete('/restaurant/:id', verifyAdmin, adminController.deleteRestaurant);

module.exports = router;