const express = require("express");

const router = express.Router();

const {
  createClassroom,
  getTeacherClassrooms,
  getClassroomById,
  startLiveClass,
  endLiveClass,
  getJitsiToken,
  getStudentClassrooms,
} = require("../controllers/classroomController");

const protect = require("../middleware/authMiddleware");

// CREATE CLASSROOM
router.post("/create", protect, createClassroom);

// GET TEACHER CLASSROOMS
router.get("/teacher", protect, getTeacherClassrooms);

// GET STUDENT CLASSROOMS
router.get("/student", protect, getStudentClassrooms);
// START LIVE
router.post("/:id/start-live", protect, startLiveClass);

// END LIVE
router.post("/:id/end-live", protect, endLiveClass);

// JITSI TOKEN
router.get("/:id/jitsi-token", protect, getJitsiToken);

// KEEP THIS LAST
router.get("/:id", protect, getClassroomById);

module.exports = router;