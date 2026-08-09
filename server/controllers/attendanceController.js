const mongoose = require("mongoose");
const Attendance = require("../models/Attendance");
const Member = require("../models/Member");

const createAttendance = async (req, res) => {
  try {
    const { member, status, date, note } = req.body;

    if (!member || !status) {
      return res.status(400).json({
        message: "Member and status are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(member)) {
      return res.status(400).json({
        message: "Invalid member ID",
      });
    }

    const existingMember = await Member.findById(member);

    if (!existingMember) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    const attendanceDate = date
      ? new Date(date)
      : new Date();

    attendanceDate.setHours(0, 0, 0, 0);

    const existingAttendance = await Attendance.findOne({
      member,
      date: attendanceDate,
    });

    if (existingAttendance) {
      return res.status(409).json({
        message: "Attendance for this member and date already exists",
      });
    }

    const attendance = await Attendance.create({
      member,
      status,
      date: attendanceDate,
      note,
      recordedBy: req.user._id,
    });

    const populatedAttendance = await Attendance.findById(
      attendance._id
    )
      .populate({
        path: "member",
        populate: {
          path: "user",
          select: "-password",
        },
      })
      .populate("recordedBy", "-password");

    res.status(201).json({
      message: "Attendance created successfully",
      attendance: populatedAttendance,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate({
        path: "member",
        populate: {
          path: "user",
          select: "-password",
        },
      })
      .populate("recordedBy", "-password")
      .sort({ date: -1 });

    res.status(200).json({
      count: attendance.length,
      attendance,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, date, note } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid attendance ID",
      });
    }

    const attendance = await Attendance.findById(id);

    if (!attendance) {
      return res.status(404).json({
        message: "Attendance record not found",
      });
    }

    if (status) {
      attendance.status = status;
    }

    if (note !== undefined) {
      attendance.note = note;
    }

    if (date) {
      const newDate = new Date(date);

      if (isNaN(newDate.getTime())) {
        return res.status(400).json({
          message: "Invalid date",
        });
      }

      newDate.setHours(0, 0, 0, 0);

      const existingAttendance = await Attendance.findOne({
        member: attendance.member,
        date: newDate,
        _id: { $ne: id },
      });

      if (existingAttendance) {
        return res.status(409).json({
          message: "Attendance for this member and date already exists",
        });
      }

      attendance.date = newDate;
    }

    attendance.recordedBy = req.user._id;

    await attendance.save();

    const updatedAttendance = await Attendance.findById(id)
      .populate({
        path: "member",
        populate: {
          path: "user",
          select: "-password",
        },
      })
      .populate("recordedBy", "-password");

    res.status(200).json({
      message: "Attendance updated successfully",
      attendance: updatedAttendance,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createAttendance,
  getAttendance,
  updateAttendance,
};