const Classroom = require("../models/Classroom");
const Test = require("../models/Test");
const Result = require("../models/Result");

exports.getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.user.id;

    // Joined classes
    const totalClasses = await Classroom.countDocuments({
      students: studentId,
    });

    // Published tests
    const upcomingTests = await Test.countDocuments({
      isPublished: true,
    });

    // Completed tests
    const completedTests = await Result.countDocuments({
      student: studentId,
    });

    // MOCK attendance
    const attendance = 92;

    res.status(200).json({
      totalClasses,
      upcomingTests,
      attendance,
      completedTests,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to load dashboard",
    });
  }
};