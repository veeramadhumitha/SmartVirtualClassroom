import { useState } from "react";
import axios from "axios";
import "./UploadTestPDF.css";

function UploadTestPDF() {
  const [file, setFile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const uploadPDF = async () => {
    if (!file) return alert("Please select a PDF file");

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("pdf", file);

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/tests/upload-pdf",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setQuestions(res.data.questions);
    } catch (err) {
      alert("PDF upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="test-upload-page">
      <div className="test-upload-card">
        <h2 className="test-title">📝 Upload Test PDF</h2>
        <p className="test-subtitle">
          Upload question paper PDF to auto-extract questions
        </p>

        <input
          type="file"
          accept="application/pdf"
          className="test-file-input"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button
          className="test-upload-btn"
          onClick={uploadPDF}
          disabled={loading}
        >
          {loading ? "Processing PDF..." : "Upload & Extract"}
        </button>
      </div>

      {questions.length > 0 && (
        <div className="question-preview">
          <h3>📚 Extracted Questions</h3>

          {questions.map((q, i) => (
            <div key={i} className="question-card">
              <h4>
                Q{i + 1}. {q.questionText}
              </h4>
              <ul>
                {q.options.map((opt, idx) => (
                  <li key={idx}>{opt}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UploadTestPDF;