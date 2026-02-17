const express = require('express');
const router = express.Router();
const RestaurantController = require('../controllers/RestaurantContoller');
const authMiddleware = require('../middleware/AuthMiddleware');

// Restaurant login
router.post('/login', RestaurantController.login);
// Get all categories
router.get('/categories', authMiddleware, RestaurantController.getCategories);
// Update category
router.put('/categories/:id', authMiddleware, RestaurantController.updateCategory);
// Delete category
router.delete('/categories/:id', authMiddleware, RestaurantController.deleteCategory);
module.exports = router;
