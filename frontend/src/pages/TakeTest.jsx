import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import "./TakeTest.css";

function TakeTest() {
  const { testId } = useParams();

  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const timerRef = useRef(null);

  // ===============================
  // Load Test
  // ===============================
  useEffect(() => {
    API.get(`/tests/${testId}`)
      .then(res => {
        setTest(res.data);
        setAnswers(new Array(res.data.questions.length).fill(null));

        if (res.data.duration !== null && !isNaN(res.data.duration)) {
          setTimeLeft(Number(res.data.duration) * 60);
        }
      })
      .catch(() => alert("Failed to load test"));
  }, [testId]);

  // ===============================
  // Timer
  // ===============================
  useEffect(() => {
    if (timeLeft === null || submitted) return;
    if (timerRef.current) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          autoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [timeLeft, submitted]);

  // ===============================
  // Handle Answer
  // ===============================
  const handleAnswer = (qi, oi) => {
    if (submitted) return;
    const updated = [...answers];
    updated[qi] = String.fromCharCode(65 + oi);
    setAnswers(updated);
  };

  // ===============================
  // Submit
  // ===============================
  const submit = async () => {
    if (submitted) return;

    if (answers.includes(null)) {
      alert("Please answer all questions");
      return;
    }
    await submitToServer();
  };

  const autoSubmit = async () => {
    if (submitted) return;
    alert("Time is up! Test auto-submitted.");
    await submitToServer();
  };

  const submitToServer = async () => {
    try {
      setSubmitted(true);
      const res = await API.post(`/tests/submit/${testId}`, { answers });
      alert(`Score: ${res.data.score}/${res.data.total}`);
    } catch {
      alert("Submission failed");
    }
  };

  if (!test) return <p className="loading">Loading test...</p>;

  return (
    <div className="take-test-page">
      {/* ===== Header ===== */}
      <div className="test-header">
        <h2>{test.title}</h2>

        {timeLeft !== null && (
          <div className="timer">
            ⏱ {Math.floor(timeLeft / 60)}:
            {(timeLeft % 60).toString().padStart(2, "0")}
          </div>
        )}
      </div>

      {/* ===== Questions ===== */}
      <div className="questions-list">
        {test.questions.map((q, i) => (
          <div key={i} className="question-card">
            <p className="question-text">
              {i + 1}. {q.questionText}
            </p>

            <div className="options">
              {q.options.map((o, oi) => {
                const optionLetter = String.fromCharCode(65 + oi);
                const selected = answers[i] === optionLetter;

                return (
                  <label
                    key={oi}
                    className={`option ${selected ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name={`q${i}`}
                      checked={selected}
                      onChange={() => handleAnswer(i, oi)}
                      disabled={submitted}
                    />
                    <span className="option-letter">{optionLetter}.</span>
                    {o}
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ===== Submit ===== */}
      <div className="submit-section">
        <button
          className="submit-btn"
          onClick={submit}
          disabled={submitted}
        >
          {submitted ? "Submitted" : "Submit Test"}
        </button>
      </div>
    </div>
  );
}

export default TakeTest;