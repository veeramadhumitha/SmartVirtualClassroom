const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getStudentDashboard,
} = require("../controllers/studentController");

// STUDENT DASHBOARD
router.get(
  "/dashboard",
  protect,
  getStudentDashboard
);

module.exports = router;