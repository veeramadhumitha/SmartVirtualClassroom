import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import "./Teachertests.css";

function TeacherTests() {
  const { classroomId } = useParams();
  const [tests, setTests] = useState([]);

  const fetchTests = async () => {
    const res = await API.get(`/tests/classroom/${classroomId}`);
    setTests(res.data);
  };

  const publishTest = async (testId) => {
    await API.put(`/tests/publish/${testId}`);
    alert("Test published");
    fetchTests();
  };

  useEffect(() => {
    fetchTests();
  }, [classroomId]);

  return (
    <div>
      <h2>Classroom Tests</h2>

      {tests.length === 0 && <p>No tests created yet</p>}

      {tests.map(test => (
        <div
          key={test._id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px"
          }}
        >
          <h4>{test.title}</h4>

          <p>
            Status:{" "}
            <b style={{ color: test.isPublished ? "green" : "orange" }}>
              {test.isPublished ? "Published" : "Draft"}
            </b>
          </p>

          {!test.isPublished && (
            <button onClick={() => publishTest(test._id)}>
              Publish
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default TeacherTests;