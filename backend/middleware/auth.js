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