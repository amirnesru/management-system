const express = require("express");

const {
  getAttendance,
  createAttendance,
  updateAttendance,
} = require("../controllers/attendanceController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/",
  protect,
  authorize("Admin", "Supervisor"),
  getAttendance
);

router.post(
  "/",
  protect,
  authorize("Admin", "Supervisor"),
  createAttendance
);

router.put(
  "/:id",
  protect,
  authorize("Admin", "Supervisor"),
  updateAttendance
);

module.exports = router;