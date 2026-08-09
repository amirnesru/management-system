const express = require("express");

const {
  createMember,
  getMembers,
  getMemberById,
  updateMember,
  deleteMember,
} = require("../controllers/memberController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("Admin", "Supervisor"),
  createMember
);

router.get(
  "/",
  protect,
  authorize("Admin", "Supervisor", "User"),
  getMembers
);

router.get(
  "/:id",
  protect,
  authorize("Admin", "Supervisor", "User"),
  getMemberById
);

router.put(
  "/:id",
  protect,
  authorize("Admin", "Supervisor"),
  updateMember
);

router.delete(
  "/:id",
  protect,
  authorize("Admin"),
  deleteMember
);

module.exports = router;