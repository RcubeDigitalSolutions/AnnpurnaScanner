require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");


const app = express();
app.use(cookieParser());

app.use(express.json());
// request logger (prints method, path and body with password masked)
app.use(require("./middleware/logger"));

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);


// routes
app.use("/api/admin", require("./routes/AdminRoutes"));
// restaurant routes
app.use("/api/restaurants", require("./routes/RestaurantRoutes"));

// public/user-facing routes
app.use("/api", require("./routes/UserRoutes"));


// DB
connectDB();


// server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
