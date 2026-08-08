const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if token exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "You are not logged in. Please sign in to continue.",
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        message: "Account not found. Your profile may have been removed.",
      });
    }

    // Attach user to request
    req.user = user;

    next();
  } catch (error) {
    // Token has expired
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Your session has expired. Please log in again.",
        code: "TOKEN_EXPIRED",
      });
    }

    // Invalid token
    return res.status(401).json({
      message: "Authentication failed. Please log in again.",
      code: "INVALID_TOKEN",
    });
  }
};

module.exports = protect;