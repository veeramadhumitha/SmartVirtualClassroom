import { useEffect, useState } from "react";
import API from "../services/api";
import "./StudentResults.css";

function StudentResults() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    API.get("/tests/results/student", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(res => setResults(res.data))
      .catch(() => alert("Error fetching results"));
  }, []);

  return (
    <div className="results-page">
      <h2 className="results-title">My Marks</h2>

      {results.length === 0 && (
        <p className="empty-text">No results available yet</p>
      )}

      <div className="results-list">
        {results.map(r => (
          <div key={r._id} className="result-card">
            <div className="result-left">
              <h4>{r.test.title}</h4>
              <p>Total Marks: {r.total}</p>
            </div>

            <div className="score-pill">
              {r.score} / {r.total}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudentResults;