const express = require('express');
const router = express.Router();
const RestaurantController = require('../controllers/RestaurantContoller');
const { verifyAdmin } = require('../middleware/auth');

// Restaurant login
router.post('/login', RestaurantController.login);
// Get all categories
router.get('/categories', verifyAdmin, RestaurantController.getCategories);
// Update category
router.put('/categories/:id', verifyAdmin, RestaurantController.updateCategory);
// Delete category
router.delete('/categories/:id', verifyAdmin, RestaurantController.deleteCategory);
module.exports = router;
