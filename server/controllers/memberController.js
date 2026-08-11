const mongoose = require("mongoose");
const Member = require("../models/Member");
const User = require("../models/User");

const createMember = async (req, res) => {
  try {
    const { user, memberId, status } = req.body;

    if (!user || !memberId) {
      return res.status(400).json({
        message: "User and member ID are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(user)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const existingUser = await User.findById(user);

    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const existingMember = await Member.findOne({ user });

    if (existingMember) {
      return res.status(409).json({
        message: "This user is already a member",
      });
    }

    const existingMemberId = await Member.findOne({ memberId });

    if (existingMemberId) {
      return res.status(409).json({
        message: "Member ID already exists",
      });
    }

    const member = await Member.create({
      user,
      memberId,
      status,
    });

    const populatedMember = await Member.findById(member._id).populate(
      "user",
      "-password"
    );

    res.status(201).json({
      message: "Member created successfully",
      member: populatedMember,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getMembers = async (req, res) => {
  try {
    const members = await Member.find()
      .populate("user", "-password")
      .sort({ createdAt: -1 });

    const formattedMembers = members.map((member) => ({
      _id: member._id,
      memberId: member.memberId,
      status: member.status,

      name: member.user?.name || "",
      email: member.user?.email || "",
      role: member.user?.role || "",
      division: member.user?.division || "",
      year: member.user?.year || "",

      userId: member.user?._id || null,
    }));

    res.status(200).json({
      count: formattedMembers.length,
      members: formattedMembers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getMemberById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid member ID",
      });
    }

    const member = await Member.findById(id).populate("user", "-password");

    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    res.status(200).json({
      member,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { user, memberId, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid member ID",
      });
    }

    const member = await Member.findById(id);

    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    if (user) {
      if (!mongoose.Types.ObjectId.isValid(user)) {
        return res.status(400).json({
          message: "Invalid user ID",
        });
      }

      const existingUser = await User.findById(user);

      if (!existingUser) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const existingMember = await Member.findOne({
        user,
        _id: { $ne: id },
      });

      if (existingMember) {
        return res.status(409).json({
          message: "This user is already a member",
        });
      }

      member.user = user;
    }

    if (memberId) {
      const existingMemberId = await Member.findOne({
        memberId,
        _id: { $ne: id },
      });

      if (existingMemberId) {
        return res.status(409).json({
          message: "Member ID already exists",
        });
      }

      member.memberId = memberId;
    }

    if (status) {
      member.status = status;
    }

    await member.save();

    const updatedMember = await Member.findById(id).populate(
      "user",
      "-password"
    );

    res.status(200).json({
      message: "Member updated successfully",
      member: updatedMember,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid member ID",
      });
    }

    const member = await Member.findByIdAndDelete(id);

    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    res.status(200).json({
      message: "Member deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createMember,
  getMembers,
  getMemberById,
  updateMember,
  deleteMember,
};