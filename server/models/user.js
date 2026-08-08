const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: "Please enter a valid email",
      },
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },

    role: {
      type: String,
      required: true,
      enum: ["Admin", "Supervisor", "User"],
    },

    division: {
      type: String,
      required: [true, "Division is required"],
      trim: true,
    },

    year: {
      type: Number,
      required: [true, "Year is required"],
      min: [2000, "Year must be valid"],
      max: [2100, "Year must be valid"],
    },
  },
  {
    timestamps: true,
  }
);