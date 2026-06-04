import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

function TeacherTestProgress() {
  const { testId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await API.get(`/tests/progress/test/${testId}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [testId]);

  if (loading) return <p>Loading...</p>;

  if (!data || data.totalAttempts === 0) {
    return (
      <div>
        <h2>Test Performance</h2>
        <p>No student attempts yet</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Test Performance</h2>

      <p><b>Total Attempts:</b> {data.totalAttempts}</p>
      <p><b>Average Score:</b> {data.averageScore}</p>
      <p><b>Highest Score:</b> {data.highestScore}</p>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Email</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {data.results.map(r => (
            <tr key={r._id}>
              <td>{r.student.name}</td>
              <td>{r.student.email}</td>
              <td>{r.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TeacherTestProgress;