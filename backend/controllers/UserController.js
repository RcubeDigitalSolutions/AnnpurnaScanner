const Restaurant = require("../models/Restaurant");
const MenuItem = require("../models/MenuItem");
const Order = require("../models/Order");

//get all restaurants
exports.getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.status(200).json({ restaurants });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

//get all menuitems by category
exports.getMenuItemsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const menuItems = await MenuItem.find({ category: categoryId })
            .populate("restaurant")
            .populate("category");
        res.status(200).json({ menuItems });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

//get menu all item (sorted by categoery)

exports.getMenuItemsSortedByCategory = async (req, res) => {
    try {
        const items = await MenuItem.aggregated([
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "categoryDetails",
                },  
            },
            {
                $unwind: "$categoryDetails",
            },
            {
                $sort: { "categoryDetails.name": 1 },
            },
        ])

        res.status(200).json({ items });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// public endpoint for menu items of a specific restaurant
exports.getRestaurantMenu = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        let menuItems = await MenuItem.find({ restaurant: restaurantId }).populate('category');
        // convert to plain objects and make sure price field exists
        menuItems = menuItems.map(mi => {
            const obj = mi.toObject();
            if (typeof obj.price !== 'number' || obj.price === 0) {
                obj.price = (obj.sizes && obj.sizes[0] ? obj.sizes[0].price : 0);
            }
            return obj;
        });
        res.status(200).json({ menuItems });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// public restaurant information (name etc.)
exports.getRestaurantInfo = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const rest = await Restaurant.findById(restaurantId).select('name');
        if (!rest) return res.status(404).json({ message: 'Restaurant not found' });
        res.status(200).json({ restaurant: rest });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// generate a unique 4-digit order number
exports.generateOrderNumber = async (req, res) => {
    try {
        let orderNumber = '';
        let exists = true;
        let attempts = 0;

        while (exists && attempts < 100) {
            attempts += 1;
            orderNumber = String(Math.floor(1000 + Math.random() * 9000));
            const existing = await Order.findOne({ orderNumber }).lean();
            exists = !!existing;
        }

        if (exists) {
            return res.status(503).json({ message: 'Unable to generate unique order number, please try again.' });
        }

        res.status(200).json({ orderNumber });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// public order tracking by order id
exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id)
            .select('orderNumber status tableNumber customerName phoneNumber items totalPrice createdAt updatedAt');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ order });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// create order from user side
exports.createOrder = async (req, res) => {
    try {
        const { restaurantId, tableNumber, customer, items, totalAmount, orderNumber } = req.body;
        if (!restaurantId || !tableNumber || !customer || !items || !totalAmount || !orderNumber) {
            return res.status(400).json({ message: "Missing order data" });
        }
        // ensure numeric values are properly parsed and validated
        const parsedTable = Number(tableNumber);
        if (isNaN(parsedTable)) {
            return res.status(400).json({ message: 'Invalid table number' });
        }
        const parsedTotal = Number(totalAmount);
        if (isNaN(parsedTotal)) {
            return res.status(400).json({ message: 'Invalid total amount' });
        }
        const normalizedOrderNumber = String(orderNumber).trim();
        if (!/^\d{4}$/.test(normalizedOrderNumber)) {
            return res.status(400).json({ message: 'Order number must be a unique 4-digit value' });
        }
        const existing = await Order.findOne({ orderNumber: normalizedOrderNumber }).lean();
        if (existing) {
            return res.status(409).json({ message: 'Order number already exists. Please generate again.' });
        }
        const orderData = {
            restaurant: restaurantId,
            tableNumber: parsedTable,
            customerName: customer.name,
            phoneNumber: customer.phone,
            orderNumber: normalizedOrderNumber,
            items: items.map(i => ({
                name: i.name,
                size: i.selectedSize || 'regular',
                // price plus any add ons; guard against NaN
                price: (() => {
                    const base = Number(i.price) || 0;
                    const addOn = Number(i.addOns) || 0;
                    return base + addOn;
                })(),
                quantity: i.quantity,
            })),
            totalPrice: parsedTotal,
        };
        const order = await Order.create(orderData);
        res.status(201).json({ order, message: 'Order placed successfully' });
    } catch (error) {
        // log error to console for debugging
        console.error('createOrder error:', error);
        res.status(500).json({ message: "Server error" });
    }
};



