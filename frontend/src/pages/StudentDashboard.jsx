import { useEffect, useState } from "react";
import StudentClasses from "./StudentClasses";
import { Link } from "react-router-dom";
import API from "../services/api";
import "./StudentDashboard.css";

function StudentDashboard() {
  const [stats, setStats] = useState({
    totalClasses: 0,
    upcomingTests: 0,
    attendance: 0,
    completedTests: 0,
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const res = await API.get("/student/dashboard");

      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="student-dashboard">

      {/* HEADER */}
      <div className="dash-header">
        <div>
          <h1>Student Dashboard</h1>
          <p>
            Welcome back! Manage your classes and activities
          </p>
        </div>

        <Link className="primary-btn" to="/student/results">
          View Marks
        </Link>
      </div>

      {/* CONTENT */}
      <div className="dashboard-content">

        {/* BENTO GRID */}
        <div className="student-bento-grid">

          <div className="bento-card purple">
            <h4>Total Classes</h4>
            <span>{stats.totalClasses}</span>
          </div>

          <div className="bento-card blue">
            <h4>Upcoming Tests</h4>
            <span>{stats.upcomingTests}</span>
          </div>

          <div className="bento-card green">
            <h4>Attendance</h4>
            <span>{stats.attendance}%</span>
          </div>

          <div className="bento-card cyan">
            <h4>Completed Tests</h4>
            <span>{stats.completedTests}</span>
          </div>

        </div>

        <StudentClasses />
      </div>
    </div>
  );
}

export default StudentDashboard;