require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Connect to MongoDB

connectDB();

// middleware

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes

const adminRoutes = require("./routes/AdminRoutes");
const restaurantRoutes = require("./routes/RestaurantRoutes");
const userRoutes = require("./routes/UserRoutes");

app.use("/api/admin", adminRoutes);
app.use("/api/restaurant", restaurantRoutes);
app.use("/api/user", userRoutes);

//default route

app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
});

// 404 Route Handler

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// GLOBAL ERROR HANDLER

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({
    message: "Internal Server Error",
    error: err.message,
  });
});

// Start the server

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
