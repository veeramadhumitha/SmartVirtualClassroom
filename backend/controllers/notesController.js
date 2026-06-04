const Notes = require("../models/Notes");

exports.uploadNotes = async (req, res) => {
  try {
    const { title, classroomId } = req.body;

    const notes = await Notes.create({
      title,
      classroomId,
      uploadedBy: req.user.id,
      fileUrl: req.file.path,
    });

    res.status(201).json({
      message: "Notes uploaded successfully",
      notes,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Upload failed",
    });
  }
};

// ================= GET CLASSROOM NOTES =================

exports.getClassroomNotes = async (req, res) => {
  try {
    const notes = await Notes.find({
      classroomId: req.params.classroomId,
    }).sort({ createdAt: -1 });

    res.status(200).json(notes);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch notes",
    });
  }
};