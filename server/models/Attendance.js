const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },

    status: {
      type: String,
      enum: ["Present", "Absent", "Excused"],
      required: true,
      default: "Absent",
    },

    date: {
      type: Date,
      required: true,
      default: () => {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        return date;
      },
    },

    note: {
      type: String,
      trim: true,
      default: null,
    },

    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

attendanceSchema.index({ member: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);