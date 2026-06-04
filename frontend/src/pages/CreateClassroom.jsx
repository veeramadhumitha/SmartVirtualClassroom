import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./CreateClassroom.css";

function CreateClassroom() {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");

  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await API.post(
        "/classroom/create",
        { name, subject, department, year },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      navigate("/teacher");
    } catch {
      alert("Failed to create classroom");
    }
  };

  return (
    <div className="create-page">
      <div className="create-wrapper">
        {/* LEFT */}
        <div className="create-info">
          <h2>Create Classroom</h2>
          <p>
            Create a virtual classroom to manage students, tests,
            attendance, and learning resources.
          </p>
        </div>

        {/* RIGHT */}
        <form className="create-card" onSubmit={handleCreate}>
          <input
            placeholder="Class Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />

          <input
            placeholder="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          />

          <input
            placeholder="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
          />

          <button type="submit">Create Classroom</button>
        </form>
      </div>
    </div>
  );
}

export default CreateClassroom;