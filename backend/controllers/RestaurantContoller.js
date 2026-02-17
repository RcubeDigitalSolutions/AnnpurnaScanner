const Restaurant = require('../models/Restaurant');
const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//restaurant login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const restaurant = await Restaurant.findOne({ email });
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        const isMatch = await restaurant.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign(
            { id: restaurant._id }, 
            process.env.JWT_SECRET, {
                expiresIn: "1d"}
        );
        res.status(200).json({ 
            message: "Login successful",
            token,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

//get all categories

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

//update category
exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        
        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );
        if (!updatedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json({updatedCategory, message: "Category updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

//delete category
exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCategory = await Category.findByIdAndDelete(id);
        if (!deletedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }   
};

//create menu item
exports.createMenuItem = async (req, res) => {
    try {
        const {CategoryId, name, size} = req.body;

        const restaurantId = req.restaurant.id;
        const menuItem = new MenuItem.create({
            restaurant: restaurantId,
            category: CategoryId,
            name,
            size,
        });
        res.status(201).json({ message: "Menu item created successfully", menuItem });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

//get menu items by restaurant
exports.getMenuItems = async (req, res) => {
    try {
        const restaurantId = req.restaurant.id;
        const menuItems = await MenuItem.find({ restaurant: restaurantId }).populate('category');
        res.status(200).json({ menuItems });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

//update menu item
exports.updateMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedMenuItem = await MenuItem.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );
        if (!updatedMenuItem) {
            return res.status(404).json({ message: "Menu item not found" });
        }
        res.status(200).json({ message: "Menu item updated successfully", updatedMenuItem });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

//delete menu item
exports.deleteMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const restaurantId = req.restaurant.id;
        const deletedMenuItem = await MenuItem.findByIdAndDelete({
            _id: id,
            restaurant: restaurantId,
        });
        if (!deletedMenuItem) {
            return res.status(404).json({ message: "Menu item not found" });
        }   
        res.status(200).json({ message: "Menu item deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

