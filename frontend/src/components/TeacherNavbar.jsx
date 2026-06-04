import "../styles/teacherNavbar.css";
import { useNavigate } from "react-router-dom";

function TeacherNavbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="logo">SmartClass</div>

      <div className="nav-right">
        <span className="role-badge">Teacher</span>
        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default TeacherNavbar;