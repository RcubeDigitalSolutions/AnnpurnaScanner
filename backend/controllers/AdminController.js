const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const Resturant = require("../models/Restaurant");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// Admin Login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    //compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    //generate token
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).json({ 
        message: "Login successful",
        token,
    });
  }catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//Restaurant Resgistration
exports.registerRestaurant = async (req, res) => {
  try {
    const { name, phoneNumber, address, email, password, totalTable } = req.body;
    const existingRestaurant = await Resturant.findOne({ email });
    if (existingRestaurant) {
      return res.status(400).json({ message: "Restaurant already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const restaurant = new Resturant({
      name,
      phoneNumber,
      address,
      email,
        password: hashedPassword,
        totalTable,
    });

    res.status(201).json({
         message: "Restaurant registered successfully",
         restaurant,
    });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }   
};

//update restaurant 
exports.updateRestaurant = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedRestaurant = await Resturant.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );
        if (!updatedRestaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        res.status(200).json({ message: "Restaurant updated successfully", updatedRestaurant });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

//delete restaurant
exports.deleteRestaurant = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRestaurant = await Resturant.findByIdAndDelete(id);
        if (!deletedRestaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        res.status(200).json({ message: "Restaurant deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

//get all restaurant
exports.getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await Resturant.find();
        res.status(200).json({ restaurants });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


