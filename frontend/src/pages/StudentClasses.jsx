import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import "./StudentClasses.css";

function StudentClasses() {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    API.get("/classroom/student", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => setClasses(res.data || []))
      .catch(() => alert("Error fetching classes"));
  }, []);

  return (
    <div className="classroom-page-wrapper">
      <div className="classroom-container">

        {/* HEADER */}
        <header className="classroom-header">
          <div>
            <h1>My Classrooms</h1>
            <p>Manage your subjects and upcoming tests in one place.</p>
          </div>
          <div className="header-stats">
            <span className="stats-number">{classes.length}</span>
            <span className="stats-label">Active Courses</span>
          </div>
        </header>

        {/* LIST */}
        <div className="classroom-list">
          {classes.map((cls) => (
            <div key={cls._id} className="compact-class-card">

              {/* LEFT */}
              <div className="left-group">
                <div className="class-avatar">
                  {cls.name.charAt(0).toUpperCase()}
                </div>

                <div className="class-info">
                  <h4>{cls.name}</h4>
                  <span>{cls.subject}</span>

                  {/* BUTTONS NEARBY */}
                  <div className="inline-actions">
                    <Link to={`/student/notes/${cls._id}`} className="pill notes">
                      📄 Notes
                    </Link>
                    <Link to={`/student/tests/${cls._id}`} className="pill tests">
                      📝 Tests
                    </Link>
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="status">
                {cls.isLive ? (
                  <Link to={`/classroom/${cls._id}/live`} className="live-btn pulse">
                    🔴 Live
                  </Link>
                ) : (
                  <span className="offline">❄️ Offline</span>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StudentClasses;