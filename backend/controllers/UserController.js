const Restaurant = require("../models/Restaurant");
const MenuItem = require("../models/MenuItem");

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



