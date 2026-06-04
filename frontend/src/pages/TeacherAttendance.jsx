import { useState } from "react";
import API from "../services/api";
import "./TeacherAttendance.css";
function TeacherAttendance() {
  // ===============================
  // STATE
  // ===============================
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [attendanceId, setAttendanceId] = useState(null);
  const [students, setStudents] = useState([]);
  const [updates, setUpdates] = useState([]);

  const [uploading, setUploading] = useState(false);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [saving, setSaving] = useState(false);

  // ===============================
  // 1️⃣ PDF UPLOAD (DEBUG VERSION)
  // ===============================
  const handlePDFUpload = async (e) => {
    console.log("🔥 FILE INPUT CHANGED");

    const file = e.target.files[0];
    console.log("🔥 SELECTED FILE:", file);

    if (!file) {
      console.log("❌ No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file); // MUST match multer field name

    console.log("🔥 FORM DATA CREATED, SENDING REQUEST...");

    try {
      setUploading(true);

      const res = await API.post(
        "/attendance/upload-pdf",
        formData
      );

      console.log("✅ UPLOAD RESPONSE:", res.data);
      alert("Students PDF uploaded successfully");

      if (res.data.department) setDepartment(res.data.department);
      if (res.data.year) setYear(res.data.year);

    } catch (err) {
      console.error("❌ UPLOAD ERROR:", err);
      console.error("❌ RESPONSE:", err.response);
      alert(
        err.response?.data?.message || "PDF upload failed"
      );
    } finally {
      setUploading(false);
    }
  };

  // ===============================
  // 2️⃣ LOAD / CREATE DAILY ATTENDANCE
  // ===============================
  const loadAttendance = async () => {
    if (!department || !year) {
      alert("Please enter department and year");
      return;
    }

    try {
      setLoadingAttendance(true);

      const res = await API.get("/attendance/daily", {
        params: { department, year, date },
      });

      console.log("✅ ATTENDANCE DATA:", res.data);

      setAttendanceId(res.data._id);

      const records = res.data.records.map((r) => ({
        studentId: r.student._id,
        name: `${r.student.rollNo} - ${r.student.name}`,
        status: r.status,
      }));

      setStudents(records);
      setUpdates(
        records.map((r) => ({
          studentId: r.studentId,
          status: r.status,
        }))
      );
    } catch (err) {
      console.error("❌ LOAD ATTENDANCE ERROR:", err);
      alert("Failed to load attendance");
    } finally {
      setLoadingAttendance(false);
    }
  };

  // ===============================
  // 3️⃣ MARK PRESENT / ABSENT
  // ===============================
  const markStatus = (studentId, status) => {
    setUpdates((prev) =>
      prev.map((u) =>
        u.studentId === studentId
          ? { ...u, status }
          : u
      )
    );
  };

  // ===============================
  // 4️⃣ SAVE ATTENDANCE
  // ===============================
  const saveAttendance = async () => {
    try {
      setSaving(true);

      await API.put("/attendance/update", {
        attendanceId,
        updates,
      });

      alert("Attendance saved successfully");
    } catch (err) {
      console.error("❌ SAVE ATTENDANCE ERROR:", err);
      alert("Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  // ===============================
  // UI
  // ===============================
  return (
    <div className="container mt-4">
      <h3 className="mb-3">📊 Attendance Management</h3>

      {/* PDF Upload */}
      <div className="mb-4">
        <label className="form-label fw-bold">
          Upload Student List PDF
        </label>
        <input
          type="file"
          accept=".pdf"
          className="form-control"
          onChange={handlePDFUpload}
          disabled={uploading}
        />
        <small className="text-muted">
          Upload once per department & year
        </small>
      </div>

      {/* Filters */}
      <div className="row mb-3">
        <div className="col">
          <input
            type="text"
            placeholder="Department (CSE)"
            className="form-control"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
        </div>

        <div className="col">
          <input
            type="number"
            placeholder="Year (3)"
            className="form-control"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>

        <div className="col">
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="col">
          <button
            className="btn btn-primary w-100"
            onClick={loadAttendance}
            disabled={loadingAttendance}
          >
            {loadingAttendance ? "Loading..." : "Load Attendance"}
          </button>
        </div>
      </div>

      {/* Student Table */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Student</th>
            <th className="text-center">Present</th>
            <th className="text-center">Absent</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 && (
            <tr>
              <td colSpan="3" className="text-center">
                No students found (upload PDF first)
              </td>
            </tr>
          )}

          {students.map((s) => (
            <tr key={s.studentId}>
              <td>{s.name}</td>

              <td className="text-center">
                <input
                  type="radio"
                  name={`attendance-${s.studentId}`}
                  checked={
                    updates.find(
                      (u) => u.studentId === s.studentId
                    )?.status === "Present"
                  }
                  onChange={() =>
                    markStatus(s.studentId, "Present")
                  }
                />
              </td>

              <td className="text-center">
                <input
                  type="radio"
                  name={`attendance-${s.studentId}`}
                  checked={
                    updates.find(
                      (u) => u.studentId === s.studentId
                    )?.status === "Absent"
                  }
                  onChange={() =>
                    markStatus(s.studentId, "Absent")
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {attendanceId && (
        <button
          className="btn btn-success"
          onClick={saveAttendance}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Attendance"}
        </button>
      )}
    </div>
  );
}

export default TeacherAttendance;