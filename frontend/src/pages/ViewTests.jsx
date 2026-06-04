import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import "./ViewTests.css";

function ViewTests() {

  const { classroomId } = useParams();

  const navigate = useNavigate();

  const [tests, setTests] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    API.get(`/tests/student/${classroomId}`)

      .then(res => setTests(res.data))

      .catch(() => {})

      .finally(() => setLoading(false));

  }, [classroomId]);

  if (loading) {

    return (

      <div className="tests-loading">

        <div className="loader"></div>

        <p>Loading tests...</p>

      </div>
    );
  }

  return (

    <div className="tests-page">

      <div className="tests-header">

        <h2>Available Tests</h2>

        <p>
          Select a test and start your assessment
        </p>

      </div>

      {tests.length === 0 && (

        <div className="no-tests">

          <p>
            No tests available right now 📭
          </p>

        </div>
      )}

      <div className="tests-grid">

        {tests.map((test, index) => (

          <div
            key={test._id}
            className="test-card"
            style={{
              animationDelay: `${index * 0.12}s`
            }}
          >

            <h4>{test.title}</h4>

            <div className="test-info">

              {test.questions.length}
              {" "}Questions

            </div>

            {test.attempted ? (

              <button
                className="completed-btn"
                disabled
              >
                Completed
              </button>

            ) : (

              <button
                className="start-btn"
                onClick={() =>
                  navigate(
                    `/student/test/${test._id}`
                  )
                }
              >
                Start Test →
              </button>

            )}

          </div>
        ))}

      </div>
    </div>
  );
}

export default ViewTests;