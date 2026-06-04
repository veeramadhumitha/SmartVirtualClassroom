import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import "./CreateTest.css";

function CreateTest() {
  const { classroomId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [questions, setQuestions] = useState([]);
  const [questionFile, setQuestionFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // ===============================
  // Upload TXT & extract questions
  // ===============================
  const uploadQuestions = async () => {

    if (!questionFile) {
      alert("Please select a TXT file");
      return;
    }

    try {

      setLoading(true);

      const formData = new FormData();

      formData.append("pdf", questionFile);

      const res = await API.post(
        "/tests/upload-pdf",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const extracted = res.data?.questions || [];

      setQuestions(
        extracted.map((q) => ({
          questionText: q.questionText || "",

          options:
            q.options?.length === 4
              ? q.options
              : ["", "", "", ""],

          correctAnswer:
            q.correctAnswer || "",
        }))
      );

      alert("Questions extracted successfully");

    } catch (err) {

      console.error(err);

      alert("Failed to upload file");

    } finally {

      setLoading(false);
    }
  };

  // ===============================
  // Add manual question
  // ===============================
  const addQuestion = () => {

    setQuestions([
      ...questions,
      {
        questionText: "",
        options: ["", "", "", ""],
        correctAnswer: "",
      },
    ]);
  };

  // ===============================
  // Save Test
  // ===============================
  const saveTest = async () => {

    if (!title || questions.length === 0) {

      alert(
        "Title and at least one question required"
      );

      return;
    }

    try {

      await API.post("/tests/create", {
        title,
        classroomId,
        duration:
          duration ? Number(duration) : null,
        questions,
      });

      alert("Test created successfully");

      setTitle("");
      setDuration("");
      setQuestions([]);
      setQuestionFile(null);

    } catch (err) {

      console.error(err);

      alert("Failed to save test");
    }
  };

  return (
    <div className="create-test-container">

      <h2>Create Test</h2>

      {/* TEST DETAILS */}
      <input
        type="text"
        placeholder="Test Title"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
      />

      <input
        type="number"
        placeholder="Duration (minutes)"
        value={duration}
        min={1}
        onChange={(e) =>
          setDuration(e.target.value)
        }
      />

      <hr />

      {/* TXT FILE UPLOAD */}
      <h3>Upload Question TXT File</h3>

      <input
        type="file"
        accept=".txt"
        onChange={(e) =>
          setQuestionFile(e.target.files[0])
        }
      />

      <button
        className="btn-primary"
        onClick={uploadQuestions}
        disabled={loading}
      >
        {loading
          ? "Processing..."
          : "Upload Questions"}
      </button>

      <hr />

      {/* QUESTIONS */}
      <h3>Questions</h3>

      {questions.length === 0 && (
        <p>No questions added yet</p>
      )}

      {questions.map((q, i) => (

        <div
          key={i}
          className="question-card"
        >

          {/* QUESTION */}
          <input
            type="text"
            placeholder={`Question ${i + 1}`}
            value={q.questionText}
            onChange={(e) => {

              const updated = [...questions];

              updated[i].questionText =
                e.target.value;

              setQuestions(updated);
            }}
          />

          {/* OPTIONS */}
          <div className="options-grid">

            {q.options.map((opt, idx) => (

              <input
                key={idx}
                type="text"
                placeholder={`Option ${String.fromCharCode(
                  65 + idx
                )}`}
                value={opt}
                onChange={(e) => {

                  const updated = [...questions];

                  updated[i].options[idx] =
                    e.target.value;

                  setQuestions(updated);
                }}
              />
            ))}

          </div>

          {/* CORRECT ANSWER */}
          <div className="correct-options">

            {["A", "B", "C", "D"].map((opt) => (

              <button
                key={opt}
                type="button"
                className={
                  q.correctAnswer === opt
                    ? "option-btn selected"
                    : "option-btn"
                }
                onClick={() => {

                  const updated = [...questions];

                  updated[i].correctAnswer =
                    opt;

                  setQuestions(updated);
                }}
              >
                {opt}
              </button>
            ))}

          </div>
        </div>
      ))}

      {/* ACTIONS */}
      <div className="actions">

        <button
          className="btn-secondary"
          onClick={addQuestion}
        >
          Add Question
        </button>

        <button
          className="btn-success"
          onClick={saveTest}
        >
          Save Test
        </button>

        <button
          className="btn-secondary"
          onClick={() =>
            navigate(
              `/teacher/classroom/${classroomId}/tests`
            )
          }
        >
          Go to Test List
        </button>

      </div>
    </div>
  );
}

export default CreateTest;