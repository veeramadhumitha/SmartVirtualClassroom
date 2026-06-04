import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import "./UploadNotes.css";

function UploadNotes() {
  const { classroomId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("classroomId", classroomId);
    formData.append("file", file);

    try {
      setLoading(true);
      await API.post("/notes/upload", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      alert("Notes uploaded successfully");
      navigate(-1); // go back to previous page
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-card">
        <h2 className="upload-title">📘 Upload Classroom Notes</h2>
        <p className="upload-subtitle">
          Share PDFs or documents with your students
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Notes Title</label>
            <input
              type="text"
              className="custom-input"
              placeholder="Enter notes title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Upload File</label>
            <input
              type="file"
              className="custom-file"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
          </div>

          <button
            type="submit"
            className="upload-btn"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload Notes"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UploadNotes;