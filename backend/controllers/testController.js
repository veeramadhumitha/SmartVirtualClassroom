const Test = require("../models/Test");
const Result = require("../models/Result");
const fs = require("fs");

// ================= CREATE TEST =================

exports.createTest = async (req, res) => {

  try {

    const {
      title,
      classroomId,
      duration,
      questions
    } = req.body;

    const test = await Test.create({

      title,
      classroomId,
      duration,
      questions,

      createdBy: req.user.id,
    });

    res.status(201).json({

      message: "Test created successfully",

      test,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Failed to create test",
    });
  }
};


// ================= GET TESTS =================

exports.getClassroomTests = async (req, res) => {

  try {

    const tests = await Test.find({

      classroomId: req.params.classroomId,

    });

    res.status(200).json(tests);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Failed to load tests",
    });
  }
};


// ================= PUBLISH TEST =================

exports.publishTest = async (req, res) => {

  try {

    const test = await Test.findByIdAndUpdate(

      req.params.testId,

      {
        isPublished: true,
      },

      {
        returnDocument: "after",
      }
    );

    if (!test) {

      return res.status(404).json({
        message: "Test not found",
      });
    }

    res.status(200).json({

      message: "Test published successfully",

      test,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Failed to publish test",
    });
  }
};


// ================= TXT QUESTION EXTRACTION =================

exports.uploadPDFQuestions = async (req, res) => {

  try {

    if (!req.file) {

      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    // READ TXT FILE
    const text = fs.readFileSync(
      req.file.path,
      "utf-8"
    );

    // SPLIT QUESTIONS
    const blocks = text
      .split(/\d+\./)
      .filter(Boolean);

    const questions = [];

    for (let block of blocks) {

      const lines = block
        .split("\n")
        .map(line => line.trim())
        .filter(Boolean);

      if (lines.length < 6) continue;

      questions.push({

        questionText: lines[0],

        options: [

          lines[1].replace("A. ", ""),

          lines[2].replace("B. ", ""),

          lines[3].replace("C. ", ""),

          lines[4].replace("D. ", ""),
        ],

        correctAnswer:
          lines[5].replace(
            "Answer: ",
            ""
          ),
      });
    }

    res.status(200).json({
      questions,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Extraction failed",
    });
  }
};


// ================= CLASSROOM PROGRESS =================

exports.getClassroomProgress = async (req, res) => {

  try {

    const results = await Result.find({

      classroom: req.params.classroomId,

    })

      .populate("student", "name email")

      .populate("test", "title");

    res.status(200).json(results);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Failed to load progress",
    });
  }
};


// ================= TEST PROGRESS =================

exports.getTestProgress = async (req, res) => {

  try {

    const results = await Result.find({

      test: req.params.testId,

    }).populate("student", "name email");

    const totalAttempts = results.length;

    const totalScore = results.reduce(

      (sum, r) => sum + r.score,

      0
    );

    const highestScore =

      results.length > 0

        ? Math.max(
            ...results.map(r => r.score)
          )

        : 0;

    const averageScore =

      totalAttempts > 0

        ? (
            totalScore / totalAttempts
          ).toFixed(2)

        : 0;

    res.status(200).json({

      totalAttempts,

      averageScore,

      highestScore,

      results,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Failed to load test progress",
    });
  }
};


// ================= STUDENT TESTS =================

exports.getStudentTests = async (req, res) => {

  try {

    const tests = await Test.find({

      classroomId: req.params.classroomId,

      isPublished: true,

    }).sort({ createdAt: -1 });

    const updatedTests = [];

    for (let test of tests) {

      const alreadyAttempted =
        await Result.findOne({

          student: req.user.id,

          test: test._id,
        });

      updatedTests.push({

        ...test._doc,

        attempted: !!alreadyAttempted,
      });
    }

    res.status(200).json(updatedTests);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Failed to fetch tests",
    });
  }
};


// ================= GET SINGLE TEST =================

exports.getSingleTest = async (req, res) => {

  try {

    const test = await Test.findById(
      req.params.testId
    );

    if (!test) {

      return res.status(404).json({
        message: "Test not found",
      });
    }

    res.status(200).json(test);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Failed to load test",
    });
  }
};


// ================= SUBMIT TEST =================

exports.submitTest = async (req, res) => {

  try {

    const { answers } = req.body;

    const test = await Test.findById(
      req.params.testId
    );

    if (!test) {

      return res.status(404).json({
        message: "Test not found",
      });
    }

    // CHECK ALREADY ATTEMPTED
    const existingResult =
      await Result.findOne({

        student: req.user.id,

        test: test._id,
      });

    if (existingResult) {

      return res.status(400).json({
        message: "Test already submitted",
      });
    }

    let score = 0;

    test.questions.forEach((q, i) => {

      if (
        answers[i] === q.correctAnswer
      ) {
        score++;
      }
    });

    // SAVE RESULT
    await Result.create({

      student: req.user.id,

      test: test._id,

      classroom: test.classroomId,

      score,

      total: test.questions.length,
    });

    res.status(200).json({

      score,

      total: test.questions.length,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Submission failed",
    });
  }
};

// ================= STUDENT RESULTS =================

exports.getStudentResults = async (req, res) => {

  try {

    const results = await Result.find({

      student: req.user.id,

    })

      .populate("test", "title")

      .sort({ createdAt: -1 });

    res.status(200).json(results);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Failed to fetch results",
    });
  }
};