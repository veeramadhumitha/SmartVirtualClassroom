// pages/TeacherClassroom.jsx
import "../styles/teacherClassroom.css";
import TeacherNavbar from "../components/TeacherNavbar";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

// 🔹 Dummy students generator
const generateDummyStudents = (classroomId) =>
  Array.from({ length: 20 }, (_, i) => ({
    id: `${classroomId}-STU-${i + 1}`,
    rollNo: i + 1,
    name: `Student ${i + 1}`,
    email: `student${i + 1}@example.com`,
    attendance: Math.floor(Math.random() * 20) + 80,
  }));

function TeacherClassroom() {
  const { classroomId } = useParams();
  const navigate = useNavigate();

  const [classroom, setClassroom] = useState(null);
  const [tests, setTests] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadClassroom();
    loadTests();
    setStudents(generateDummyStudents(classroomId));
  }, [classroomId]);

  const loadClassroom = async () => {
    try {
      const res = await API.get(`/classroom/${classroomId}`);
      setClassroom(res.data);
    } catch {
      alert("Failed to load classroom");
    }
  };

  const loadTests = async () => {
    try {
      const res = await API.get(`/tests/classroom/${classroomId}`);
      setTests(res.data);
    } catch {
      console.error("Failed to load tests");
    }
  };

  const startLive = async () => {
    setLoading(true);
    try {
      await API.post(`/classroom/${classroomId}/start-live`);
      await loadClassroom();
      navigate(`/classroom/${classroomId}/live`);
    } catch {
      alert("Failed to start live");
    }
    setLoading(false);
  };

  const endLive = async () => {
    setLoading(true);
    try {
      await API.post(`/classroom/${classroomId}/end-live`);
      await loadClassroom();
    } catch {
      alert("Failed to end live");
    }
    setLoading(false);
  };

  if (!classroom) return <div>Loading...</div>;

  return (
    <>
      <TeacherNavbar />

      <div className="classroom-options">
        {/* ===== HEADER ===== */}
        <h1>{classroom.name}</h1>
        <p>{classroom.subject}</p>

        {/* ===== OPTIONS GRID ===== */}
        <div className="options-grid">
          <div
            className="option-card"
            onClick={() => navigate(`/teacher/upload/${classroomId}`)}
          >
            <div className="option-icon">📄</div>
            <h3>Upload Notes</h3>
            <p>Add PDFs & study materials</p>
          </div>

          <div
            className="option-card"
            onClick={() => navigate(`/teacher/test/${classroomId}`)}
          >
            <div className="option-icon">📝</div>
            <h3>Create Test</h3>
            <p>Create & manage tests</p>
          </div>

          <div
            className="option-card"
            onClick={() =>
              navigate(`/teacher/classroom/${classroomId}/attendance`)
            }
          >
            <div className="option-icon">📊</div>
            <h3>Mark Attendance</h3>
            <p>Daily attendance</p>
          </div>

          {!classroom.isLive ? (
            <div className="option-card live" onClick={startLive}>
              <div className="option-icon">🔴</div>
              <h3>{loading ? "Starting..." : "Start Live"}</h3>
              <p>Begin live session</p>
            </div>
          ) : (
            <div className="option-card end-live" onClick={endLive}>
              <div className="option-icon">⛔</div>
              <h3>{loading ? "Ending..." : "End Live"}</h3>
              <p>Stop live session</p>
            </div>
          )}
        </div>

        {/* ===== TESTS ===== */}
        <div style={{ marginTop: "45px" }}>
          <h2>Created Tests</h2>

          {tests.length === 0 ? (
            <p>No tests created yet</p>
          ) : (
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              {tests.map(test => (
                <div
                  key={test._id}
                  className="option-card"
                  style={{ minWidth: "220px" }}
                  onClick={() =>
                    navigate(
                      `/teacher/classroom/${classroomId}/test/${test._id}/progress`
                    )
                  }
                >
                  <h3>{test.title}</h3>
                  <p
                    style={{
                      fontWeight: 700,
                      color: test.isPublished ? "#16a34a" : "#f59e0b",
                    }}
                  >
                    {test.isPublished ? "Published" : "Draft"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ===== STUDENTS ===== */}
       
      </div>
    </>
  );
}

export default TeacherClassroom;