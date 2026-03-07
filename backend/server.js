require("dotenv").config();
const express = require("express");
const http = require("http");
const connectDB = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { setupSocket } = require("./socket");


const app = express();
app.use(cookieParser());

app.use(express.json());
// request logger (prints method, path and body with password masked)
app.use(require("./middleware/logger"));

const normalizeOrigin = (value) => String(value || '').trim().replace(/\/$/, '');

const CLIENT_URLS = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((url) => normalizeOrigin(url))
  .filter(Boolean);

const FALLBACK_DEV_ORIGINS = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
].map(normalizeOrigin);

const ALLOWED_ORIGINS = Array.from(new Set([...CLIENT_URLS, ...FALLBACK_DEV_ORIGINS]));

const corsOriginValidator = (origin, callback) => {
  // Allow non-browser clients (no Origin header), e.g. curl/Postman/mobile debugging.
  if (!origin) return callback(null, true);

  // In development, keep CORS permissive to avoid local LAN/mobile origin mismatches.
  if (process.env.NODE_ENV !== 'production') return callback(null, true);

  const normalizedOrigin = normalizeOrigin(origin);
  if (ALLOWED_ORIGINS.includes(normalizedOrigin)) return callback(null, true);

  // Don't throw here; deny CORS without turning request into a 500.
  return callback(null, false);
};

app.use(
  cors({
    origin: corsOriginValidator,
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
const server = http.createServer(app);
const io = setupSocket(server, ALLOWED_ORIGINS);
app.set("io", io);

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
