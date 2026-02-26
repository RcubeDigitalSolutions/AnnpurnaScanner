const Admin = require("../models/Admin");
const Restaurant = require("../models/Restaurant");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// ================= ADMIN LOGIN =================
// controllers/adminController.js

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ACCESS TOKEN (short)
    const accessToken = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // REFRESH TOKEN (long)
    const refreshToken = jwt.sign(
      { id: admin._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // send refresh token in httpOnly cookie and return access token in JSON
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
    res.status(500).json({ message: error.message });
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
      { id: decoded.id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // return new access token in JSON so client can store it (localStorage)
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


// ================= CREATE ADMIN (ONE TIME) =================
exports.createAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const exists = await Admin.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({
      username,
      email,
      password: hashedPassword,
    });

    await admin.save();

    res.status(201).json({
      message: "Admin created successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= REGISTER RESTAURANT =================
exports.registerRestaurant = async (req, res) => {
  try {
    const { name, phoneNumber, address, email, password, totalTable } = req.body;

    const existingRestaurant = await Restaurant.findOne({ email });
    if (existingRestaurant) {
      return res.status(400).json({ message: "Restaurant already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const restaurant = new Restaurant({
      name,
      phoneNumber,
      address,
      email,
      password: hashedPassword,
      totalTable,
    });

    await restaurant.save();

    res.status(201).json({
      message: "Restaurant registered successfully",
      restaurant,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= UPDATE RESTAURANT =================
exports.updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updatedRestaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json({
      message: "Restaurant updated successfully",
      updatedRestaurant,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= DELETE RESTAURANT =================
exports.deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRestaurant = await Restaurant.findByIdAndDelete(id);

    if (!deletedRestaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json({
      message: "Restaurant deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= GET ALL RESTAURANTS =================
exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();

    res.status(200).json({ restaurants });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET CURRENT ADMIN
exports.me = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const admin = await Admin.findById(userId).select('-password');
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    res.json({ admin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};