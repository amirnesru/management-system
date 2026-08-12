const mongoose = require("mongoose");
const Member = require("../models/Member");
const User = require("../models/User");

/*
|--------------------------------------------------------------------------
| Helper: Format member response
|--------------------------------------------------------------------------
*/

const formatMember = (member) => {
  return {
    _id: member._id,
    memberId: member.memberId,
    status: member.status,

    name: member.user?.name || "",
    email: member.user?.email || "",
    role: member.user?.role || "",
    division: member.user?.division || "",
    year: member.user?.year || "",

    userId: member.user?._id || null,
    avatarUrl: member.user?.avatarUrl || null,
  };
};

/*
|--------------------------------------------------------------------------
| CREATE MEMBER
|--------------------------------------------------------------------------
|
| Admin creates a member using an existing User ID.
|
| Expected body:
|
| {
|   "user": "USER_ID",
|   "memberId": "MEM002",
|   "status": "On Campus"
| }
|
*/

const createMember = async (req, res) => {
  try {
    const { user, memberId, status } = req.body;

    if (!user) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    if (!memberId) {
      return res.status(400).json({
        message: "Member ID is required",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Validate User ID
    |--------------------------------------------------------------------------
    */

    if (!mongoose.Types.ObjectId.isValid(user)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Check user exists
    |--------------------------------------------------------------------------
    */

    const existingUser = await User.findById(user);

    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Check user is not already a member
    |--------------------------------------------------------------------------
    */

    const existingMember = await Member.findOne({
      user,
    });

    if (existingMember) {
      return res.status(409).json({
        message: "This user is already a member",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Check member ID
    |--------------------------------------------------------------------------
    */

    const existingMemberId = await Member.findOne({
      memberId,
    });

    if (existingMemberId) {
      return res.status(409).json({
        message: "Member ID already exists",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Create Member
    |--------------------------------------------------------------------------
    */

    const member = await Member.create({
      user,
      memberId,
      status: status || "On Campus",
    });

    /*
    |--------------------------------------------------------------------------
    | Get populated member
    |--------------------------------------------------------------------------
    */

    const populatedMember = await Member.findById(member._id).populate(
      "user",
      "-password",
    );

    /*
    |--------------------------------------------------------------------------
    | Return flat response
    |--------------------------------------------------------------------------
    */

    res.status(201).json({
      message: "Member created successfully",
      member: formatMember(populatedMember),
    });
  } catch (error) {
    console.error("Create member error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET ALL MEMBERS
|--------------------------------------------------------------------------
*/

const getMembers = async (req, res) => {
  try {
    const members = await Member.find()
      .populate("user", "-password")
      .sort({ createdAt: -1 });

    const formattedMembers = members.map(formatMember);

    res.status(200).json({
      count: formattedMembers.length,
      members: formattedMembers,
    });
  } catch (error) {
    console.error("Get members error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET MEMBER BY ID
|--------------------------------------------------------------------------
*/

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
      member: formatMember(member),
    });
  } catch (error) {
    console.error("Get member error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE MEMBER
|--------------------------------------------------------------------------
|
| Updates:
|
| Member:
|   - memberId
|   - status
|
| User:
|   - name
|   - role
|   - division
|   - year
|
*/

const updateMember = async (req, res) => {
  try {
    const { id } = req.params;

    const { user, memberId, status, name, role, division, year } = req.body;

    /*
    |--------------------------------------------------------------------------
    | Validate Member ID
    |--------------------------------------------------------------------------
    */

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid member ID",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Find Member
    |--------------------------------------------------------------------------
    */

    const member = await Member.findById(id);

    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Find User
    |--------------------------------------------------------------------------
    */

    let userId = user || member.user;

    if (!userId) {
      return res.status(400).json({
        message: "This member does not have a user account",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const existingUser = await User.findById(userId);

    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | If changing user, check duplicate membership
    |--------------------------------------------------------------------------
    */

    if (user && user.toString() !== member.user.toString()) {
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

    /*
    |--------------------------------------------------------------------------
    | Update Member ID
    |--------------------------------------------------------------------------
    */

    if (memberId && memberId !== member.memberId) {
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

    /*
    |--------------------------------------------------------------------------
    | Update Member Status
    |--------------------------------------------------------------------------
    */

    if (status) {
      member.status = status;
    }

    /*
    |--------------------------------------------------------------------------
    | Update User Information
    |--------------------------------------------------------------------------
    */

    if (name !== undefined) {
      existingUser.name = name;
    }

    if (role !== undefined) {
      const allowedRoles = ["Admin", "Supervisor", "User"];

      if (!allowedRoles.includes(role)) {
        return res.status(400).json({
          message: "Invalid role",
        });
      }

      existingUser.role = role;
    }

    if (division !== undefined) {
      existingUser.division = division;
    }

    if (year !== undefined) {
      existingUser.year = year;
    }
    await existingUser.save();
    await member.save();

    const updatedMember = await Member.findById(id).populate(
      "user",
      "-password",
    );

    res.status(200).json({
      message: "Member updated successfully",
      member: formatMember(updatedMember),
    });
  } catch (error) {
    console.error("Update member error:", error);

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
    console.error("Delete member error:", error);

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
