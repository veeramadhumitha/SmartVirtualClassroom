import "../styles/teacherDashboard.css";
import TeacherNavbar from "../components/TeacherNavbar";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../services/api";

function TeacherDashboard() {
  const [classes, setClasses] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  // ✅ FETCH CLASSES
  const loadClasses = async () => {
    try {
      const res = await API.get("/classroom/teacher", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setClasses(res.data);
    } catch (err) {
      alert("Failed to load classrooms");
    }
  };

  // ✅ LOAD ON FIRST OPEN
  useEffect(() => {
    loadClasses();
  }, []);

  // ✅ RELOAD WHEN COMING BACK
  useEffect(() => {
    loadClasses();
  }, [location.pathname]);

  return (
    <>
      <TeacherNavbar />

      <div className="teacher-dashboard">

        {/* HEADER */}
        <div className="dash-header">
          <div>
            <h1>Teacher Dashboard 👋</h1>
            <p>Manage your classrooms</p>
          </div>

          <button
            className="primary-btn"
            onClick={() => navigate("/teacher/create-classroom")}
          >
            + Create Classroom
          </button>
        </div>

        {/* STATS */}
        <div className="stats-grid">
          <div className="stat-card">
            <h2>{classes.length}</h2>
            <span>Total Classes</span>
          </div>

          <div className="stat-card live">
            <h2>{classes.filter(c => c.isLive).length}</h2>
            <span>Live Classes</span>
          </div>
        </div>

        {/* CLASSES */}
        <div className="class-grid">
          {classes.length === 0 ? (
            <div className="empty-state">
              No classrooms created yet
            </div>
          ) : (
            classes.map((cls) => (
              <div
                key={cls._id}
                className="class-card"
                onClick={() =>
                  navigate(`/teacher/classroom/${cls._id}`)
                }
              >
                <div className="class-header">
                  <h3>{cls.name}</h3>
                  {cls.isLive && (
                    <span className="live-badge">LIVE</span>
                  )}
                </div>

                <p>{cls.subject}</p>
                <p>{cls.department} • Year {cls.year}</p>
              </div>
            ))
          )}
        </div>

      </div>
    </>
  );
}

export default TeacherDashboard;