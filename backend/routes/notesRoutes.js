const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

const {
  uploadNotes,
  getClassroomNotes,
} = require("../controllers/notesController");

// UPLOAD NOTES
router.post(
  "/upload",
  protect,
  upload.single("file"),
  uploadNotes
);
// GET NOTES OF CLASSROOM
router.get(
  "/:classroomId",
  protect,
  getClassroomNotes
);

module.exports = router;