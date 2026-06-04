import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

function TeacherProgress() {
  const { classroomId } = useParams();
  const [results, setResults] = useState([]);

  useEffect(() => {
    API.get(`/tests/progress/${classroomId}`)
      .then(res => setResults(res.data))
      .catch(err => console.error(err));
  }, [classroomId]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Student Performance</h2>

      {results.length === 0 && <p>No submissions yet</p>}

      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>Student</th>
            <th>Email</th>
            <th>Test</th>
            <th>Score</th>
            <th>Total</th>
            <th>Percentage</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, i) => (
            <tr key={i}>
              <td>{r.student?.name || "N/A"}</td>
              <td>{r.student?.email}</td>
              <td>{r.test?.title}</td>
              <td>{r.score}</td>
              <td>{r.total}</td>
              <td>{Math.round((r.score / r.total) * 100)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TeacherProgress;