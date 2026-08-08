const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: validator.isEmail,
        message: "Please enter a valid email address",
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
      default: "User",
    },

    title: {
      type: String,
      trim: true,
      default: null,
    },

    avatarUrl: {
      type: String,
      trim: true,
      default: null,
    },

    division: {
      type: String,
      required: [true, "Division is required"],
      trim: true,
    },

    year: {
      type: String,
      required: [true, "Year is required"],
      enum: ["1st", "2nd", "3rd", "4th", "5th"],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ division: 1, role: 1 });

module.exports = mongoose.model("User", userSchema);