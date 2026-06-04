const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
    },

    classroom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classroom",
    },

    score: Number,

    total: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Result", resultSchema);