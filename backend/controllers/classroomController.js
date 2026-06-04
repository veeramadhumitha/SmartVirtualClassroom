const Classroom = require("../models/Classroom");

// ================= CREATE CLASSROOM =================

exports.createClassroom = async (req, res) => {
  try {
    const { name, subject, department, year } = req.body;

    const classroom = await Classroom.create({
      name,
      subject,
      department,
      year,
      teacher: req.user.id,
    });

    res.status(201).json({
      message: "Classroom created",
      classroom,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ================= GET TEACHER CLASSROOMS =================

exports.getTeacherClassrooms = async (req, res) => {
  try {
    const classrooms = await Classroom.find({
      teacher: req.user.id,
    });

    res.status(200).json(classrooms);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ================= GET CLASSROOM BY ID =================

exports.getClassroomById = async (req, res) => {
  try {
    const classroom = await Classroom.findById(req.params.id);

    if (!classroom) {
      return res.status(404).json({
        message: "Classroom not found",
      });
    }

    res.status(200).json(classroom);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to load classroom",
    });
  }
};

// ================= START LIVE =================

exports.startLiveClass = async (req, res) => {
  try {
    const classroom = await Classroom.findByIdAndUpdate(
      req.params.id,
      { isLive: true },
      { new: true }
    );

    res.status(200).json({
      message: "Live class started",
      classroom,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to start live class",
    });
  }
};

// ================= END LIVE =================

exports.endLiveClass = async (req, res) => {
  try {
    const classroom = await Classroom.findByIdAndUpdate(
      req.params.id,
      { isLive: false },
      { new: true }
    );

    res.status(200).json({
      message: "Live class ended",
      classroom,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to end live class",
    });
  }
};

// ================= JITSI TOKEN =================

exports.getJitsiToken = async (req, res) => {
  try {
    res.status(200).json({
      token: "",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to generate token",
    });
  }
};


// ================= STUDENT CLASSROOMS =================

// ================= STUDENT CLASSROOMS =================

exports.getStudentClassrooms = async (req, res) => {
  try {
    const classrooms = await Classroom.find({
      department: req.user.department,
      year: req.user.year,
    });

    res.status(200).json(classrooms);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch classrooms",
    });
  }
};