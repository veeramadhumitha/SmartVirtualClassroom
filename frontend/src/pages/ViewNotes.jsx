import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import "./ViewNotes.css";

function ViewNotes() {
  const { classroomId } = useParams();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/notes/${classroomId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => setNotes(res.data))
      .catch(() => alert("Error loading notes"))
      .finally(() => setLoading(false));
  }, [classroomId]);

  return (
    <div className="notes-page">
      <div className="notes-header">
        <h2>Class Notes</h2>
        <p>Download or view notes shared by your teacher</p>
      </div>

      {loading && <p className="loading-text">Loading notes...</p>}

      {!loading && notes.length === 0 && (
        <div className="empty-state">
          <p>📄 No notes uploaded yet</p>
        </div>
      )}

      <div className="notes-list">
        {notes.map(note => (
          <div className="note-card" key={note._id}>
            <div className="note-info">
              <span className="note-icon">📘</span>
              <div>
                <h4>{note.title}</h4>
                <p>PDF / Document</p>
              </div>
            </div>

            <div className="note-actions">
              <a
                href={`http://localhost:5000/${note.fileUrl}`}
                target="_blank"
                rel="noreferrer"
                className="btn view"
              >
                View
              </a>

              <a
                href={`http://localhost:5000/${note.fileUrl}`}
                download
                className="btn download"
              >
                Download
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ViewNotes;