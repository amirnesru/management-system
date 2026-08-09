const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const memberRoutes = require("./routes/memberRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Connect to database
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/members", memberRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});