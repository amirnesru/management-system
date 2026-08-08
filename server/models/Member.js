const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    memberId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    status: {
      type: String,
      required: true,
      enum: ["On Campus", "Off Campus", "Withdrawn"],
      default: "On Campus",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Member", memberSchema);