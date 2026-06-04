const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionText: String,

  options: [String],

  correctAnswer: String,
});

const testSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    classroomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classroom",
    },

    duration: Number,

    questions: [questionSchema],

    isPublished: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Test", testSchema);