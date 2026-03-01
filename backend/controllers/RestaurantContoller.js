const Restaurant = require('../models/Restaurant');
const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');
const Table = require('../models/Table');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//restaurant login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const restaurant = await Restaurant.findOne({ email });
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        // If restaurant plan/status is not active, deny login
        if (restaurant.status && restaurant.status !== 'active') {
            return res.status(403).json({ message: 'Your plan has expired. Contact the service provider for further details.' });
        }
        const isMatch = await bcrypt.compare(password, restaurant.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        // ACCESS TOKEN (short-lived)
        const accessToken = jwt.sign(
            { id: restaurant._id, role: "restaurant" },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        // REFRESH TOKEN (long-lived)
        const refreshToken = jwt.sign(
            { id: restaurant._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: "7d" }
        );

        // send refresh token as httpOnly cookie and return access token
        const refreshOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        };

        res.cookie("refreshToken", refreshToken, refreshOptions);

        res.status(200).json({
            message: "Login successful",
            accessToken,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

    // REFRESH TOKEN
    exports.refreshToken = (req, res) => {
        try {
            const token = req.cookies.refreshToken;

            if (!token) {
                return res.status(401).json({ message: "No refresh token" });
            }

            const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

            const accessToken = jwt.sign(
                { id: decoded.id, role: "restaurant" },
                process.env.JWT_SECRET,
                { expiresIn: "15m" }
            );

            res.json({ accessToken });
        } catch (error) {
            res.status(403).json({ message: "Invalid refresh token" });
        }
    };

    // LOGOUT
    exports.logout = (req, res) => {
        res.clearCookie("refreshToken");
        res.clearCookie("accessToken");
        res.json({ message: "Logged out successfully" });
    };

    // GET CURRENT RESTAURANT
    exports.me = async (req, res) => {
        try {
            const userId = req.restaurant && req.restaurant.id;
            if (!userId) return res.status(401).json({ message: 'Unauthorized' });

            const restaurant = await Restaurant.findById(userId).select('-password');
            if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

            res.json({ restaurant });
        } catch (error) {
            res.status(500).json({ message: error.message });
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
        const { categoryId, name, description, price, sizes, available, foodType } = req.body;

        const restaurantId = req.restaurant.id;

        const menuItemData = {
            restaurant: restaurantId,
            category: categoryId,
            name,
            description: description || '',
            price: typeof price === 'number' ? price : 0,
            sizes: Array.isArray(sizes) ? sizes : [],
            available: typeof available === 'boolean' ? available : true,
            foodType: foodType || 'veg',
        };

        const menuItem = await MenuItem.create(menuItemData);
        const populated = await menuItem.populate('category');
        res.status(201).json({ message: "Menu item created successfully", menuItem: populated });
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
        // only allow certain fields to be updated for safety
        const updateData = {};
        [
          'name',
          'description',
          'price',
          'sizes',
          'available',
          'foodType',
          'categoryId',
        ].forEach(field => {
          if (req.body[field] !== undefined) {
            if (field === 'categoryId') {
              updateData.category = req.body.categoryId;
            } else {
              updateData[field] = req.body[field];
            }
          }
        });
        const updatedMenuItem = await MenuItem.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );
        if (!updatedMenuItem) {
            return res.status(404).json({ message: "Menu item not found" });
        }
        const populated = await updatedMenuItem.populate('category');
        res.status(200).json({ message: "Menu item updated successfully", updatedMenuItem: populated });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

//delete menu item
exports.deleteMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const restaurantId = req.restaurant.id;
        const deletedMenuItem = await MenuItem.findOneAndDelete({
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

// create category (restaurant can create categories)
exports.createCategory = async (req, res) => {
    try {
        const { name, picture } = req.body;
        if (!name || !name.trim()) return res.status(400).json({ message: 'Category name is required' });
        const existing = await Category.findOne({ name: name.trim() });
        if (existing) return res.status(400).json({ message: 'Category already exists' });
        const pic = picture && picture.trim() ? picture.trim() : 'https://via.placeholder.com/160';
        const category = new Category({ name: name.trim(), picture: pic });
        await category.save();
        res.status(201).json({ message: 'Category created', category });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
};

// ---- order handling for restaurant dashboard ----

// get all orders for the logged in restaurant
exports.getOrders = async (req, res) => {
    try {
        const restaurantId = req.restaurant.id;
        const orders = await Order.find({ restaurant: restaurantId });
        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// update status of an order (restaurant side)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const restaurantId = req.restaurant.id;
        const updated = await Order.findOneAndUpdate(
            { _id: id, restaurant: restaurantId },
            { status },
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: 'Order not found' });
        res.status(200).json({ order: updated });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// ---- table management ----

// get all tables for the logged in restaurant
exports.getTables = async (req, res) => {
    try {
        const restaurantId = req.restaurant.id;
        const tables = await Table.find({ restaurant: restaurantId });
        res.status(200).json({ tables });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// create a new table
exports.createTable = async (req, res) => {
    try {
        const { number, status } = req.body;
        if (!number || number < 1) return res.status(400).json({ message: 'Valid table number required' });
        const restaurantId = req.restaurant.id;
        // enforce max tables per restaurant
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
        const count = await Table.countDocuments({ restaurant: restaurantId });
        if (restaurant.totalTable != null && count >= restaurant.totalTable) {
            return res.status(403).json({ message: `Table limit reached (${restaurant.totalTable})` });
        }
        const existing = await Table.findOne({ restaurant: restaurantId, number });
        if (existing) return res.status(400).json({ message: 'Table number already exists' });
        const table = new Table({ restaurant: restaurantId, number, status: status || 'active' });
        await table.save();
        res.status(201).json({ table, message: 'Table created' });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// update table
exports.updateTable = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const restaurantId = req.restaurant.id;
        const updated = await Table.findOneAndUpdate(
            { _id: id, restaurant: restaurantId },
            { status },
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: 'Table not found' });
        res.status(200).json({ table: updated });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// delete table
exports.deleteTable = async (req, res) => {
    try {
        const { id } = req.params;
        const restaurantId = req.restaurant.id;
        const deleted = await Table.findOneAndDelete({ _id: id, restaurant: restaurantId });
        if (!deleted) return res.status(404).json({ message: 'Table not found' });
        res.status(200).json({ message: 'Table deleted' });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

