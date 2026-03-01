const jwt = require("jsonwebtoken");

exports.verifyAdmin = (req, res, next) => {
  try {
    // Prefer Authorization header (Bearer token), fall back to accessToken cookie
    const header = req.headers.authorization;
    const cookieToken = req.cookies && req.cookies.accessToken;
    const token = header ? header.split(" ")[1] : (cookieToken || null);

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role && decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

exports.verifyRestaurant = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    const cookieToken = req.cookies && req.cookies.accessToken;
    const token = header ? header.split(" ")[1] : (cookieToken || null);

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role && decoded.role !== "restaurant") {
      return res.status(403).json({ message: "Access denied" });
    }

    // attach to req.restaurant for restaurant controllers
    req.restaurant = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Verify restaurant status (active/inactive)
exports.verifyRestaurantStatus = async (req, res, next) => {
  try {
    const restaurantId = req.restaurant && req.restaurant.id;
    if (!restaurantId) return res.status(401).json({ message: 'Unauthorized' });

    const Restaurant = require('../models/Restaurant');
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    if (restaurant.status !== 'active') {
      return res.status(403).json({ message: 'Your plan has expired. Contact the service provider for further details.' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};