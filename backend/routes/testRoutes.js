const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

const {
  createTest,
  getClassroomTests,
  uploadPDFQuestions,
  publishTest,
  getClassroomProgress,
  getTestProgress,
  getStudentTests,
  getSingleTest,
  submitTest,
  getStudentResults,
} = require("../controllers/testController");


// CREATE TEST
router.post(
  "/create",
  protect,
  createTest
);


// GET TESTS OF CLASSROOM
router.get(
  "/classroom/:classroomId",
  protect,
  getClassroomTests
);


// PDF/TXT UPLOAD
router.post(
  "/upload-pdf",
  protect,
  upload.single("pdf"),
  uploadPDFQuestions
);


// PUBLISH TEST
router.put(
  "/publish/:testId",
  protect,
  publishTest
);


// STUDENT VIEW TESTS
router.get(
  "/student/:classroomId",
  protect,
  getStudentTests
);


// SUBMIT TEST
router.post(
  "/submit/:testId",
  protect,
  submitTest
);


// STUDENT RESULTS
router.get(
  "/results/student",
  protect,
  getStudentResults
);


// CLASSROOM PERFORMANCE
router.get(
  "/progress/:classroomId",
  protect,
  getClassroomProgress
);


// SINGLE TEST PERFORMANCE
router.get(
  "/progress/test/:testId",
  protect,
  getTestProgress
);


// GET SINGLE TEST
// KEEP THIS LAST
router.get(
  "/:testId",
  protect,
  getSingleTest
);


module.exports = router;