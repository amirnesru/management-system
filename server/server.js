const express = require("express")
const connectDB = require("./config/db")
require("dotenv").config();

const app = express()
const PORT = process.env.PORT || 5000;

connectDB();

app.get("/", (req, res) => {
  res.send("Management System API is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

