const express = require("express");
require("dotenv").config();
const cors = require("cors");

const connectDB = require("./config/db");
const User = require("./models/User");

// Middleware
const protect = require("./middleware/authMiddleware");
const authorize = require("./middleware/roleMiddleware");

// Routes
const authRoutes = require("./routes/authRoutes");
const memberRoutes = require("./routes/memberRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/attendance", attendanceRoutes);

app.get(
  "/api/users",
  protect,
  authorize("Admin", "Supervisor"),
  async (req, res) => {
    try {
      const users = await User.find()
        .select("_id name email role division year")
        .sort({ name: 1 });

      res.status(200).json({
        count: users.length,
        users,
      });
    } catch (error) {
      console.error("Get users error:", error);

      res.status(500).json({
        message: "Failed to fetch users.",
        error: error.message,
      });
    }
  },
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
