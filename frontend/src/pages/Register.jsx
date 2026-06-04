import { useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import "../styles/register.css";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    department: "",
    year: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", formData);
      alert("Registration successful");
      window.location.href = "/login";
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-glass register-glass">
        <h2 className="login-title">Create Account</h2>
        <p className="login-subtitle">
          Join SmartVirtualClassroom 🚀
        </p>

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <input
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
            />
            <label>Name</label>
          </div>

          <div className="input-group">
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <label>Email</label>
          </div>

          <div className="input-group password-group">
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
            />
            <label>Password</label>
          </div>

          <div className="input-group">
            <select
              name="role"
              className="role-select"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          {formData.role === "student" && (
            <>
              <div className="input-group">
                <input
                  name="department"
                  required
                  value={formData.department}
                  onChange={handleChange}
                />
                <label>Department</label>
              </div>

              <div className="input-group">
                <input
                  name="year"
                  required
                  value={formData.year}
                  onChange={handleChange}
                />
                <label>Year</label>
              </div>
            </>
          )}

          <button className="login-btn">Register</button>
        </form>

        <div className="login-footer">
          <span>Already have an account?</span>
          <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;