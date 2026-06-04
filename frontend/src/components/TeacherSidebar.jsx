import { Link } from "react-router-dom";
import "../styles/teacherSidebar.css";

function TeacherSidebar() {
  return (
    <div className="teacher-sidebar">
      <h3>SmartVC</h3>

      <nav>
        <Link to="/teacher">Dashboard</Link>
        <Link to="/teacher/create-class">Create Class</Link>
        <Link to="/teacher/tests">Tests</Link>
        <Link to="/teacher/attendance">Attendance</Link>
      </nav>
    </div>
  );
}

export default TeacherSidebar;