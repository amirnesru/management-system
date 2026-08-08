const mongoose = require("mongoose");
const { eventNames, exists } = require("../../../course-management-api/models/User");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB Atlas connected successfully");
  } catch {
     console.error("MongoDB connection failed:", error.message);
     process.exit(1);
  }
};
module.exports = connectDB;