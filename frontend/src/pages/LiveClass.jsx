import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import "./LiveClass.css";

function LiveClass() {
  const { classroomId } = useParams();
  const navigate = useNavigate();

  const jitsiContainerRef = useRef(null);
  const jitsiApiRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const [isLive, setIsLive] = useState(false);

  // ===============================
  // 1️⃣ Poll live status
  // ===============================
  useEffect(() => {
    const checkLiveStatus = async () => {
      try {
        const res = await API.get(`/classroom/${classroomId}`);
        setIsLive(res.data.isLive);

        if (user?.role === "student" && !res.data.isLive && jitsiApiRef.current) {
          jitsiApiRef.current.executeCommand("hangup");
          jitsiApiRef.current.dispose();
          navigate("/student");
        }
      } catch (err) {
        console.error("Live status check failed");
      }
    };

    checkLiveStatus();
    const interval = setInterval(checkLiveStatus, 5000);
    return () => clearInterval(interval);
  }, [classroomId, navigate, user]);

  // ===============================
  // 2️⃣ Start Jitsi
  // ===============================
  useEffect(() => {
    if (!isLive || !jitsiContainerRef.current || jitsiApiRef.current) return;

    const startJitsi = async () => {
      const domain = "meet.jit.si";
      const roomName = `smartclassroom_${classroomId}`;

      const options = {
        roomName,
        width: "100%",
        height: "100%",
        parentNode: jitsiContainerRef.current,
        userInfo: {
          displayName: user?.name || "User"
        },
        configOverwrite: {
          prejoinPageEnabled: false
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false
        }
      };

      if (user?.role === "teacher") {
        const res = await API.get(`/classroom/${classroomId}/jitsi-token`);
        options.jwt = res.data.token;
      }

      jitsiApiRef.current = new window.JitsiMeetExternalAPI(domain, options);
    };

    startJitsi();

    return () => {
      jitsiApiRef.current?.dispose();
      jitsiApiRef.current = null;
    };
  }, [isLive, classroomId, user]);

  // ===============================
  // 3️⃣ End Class (Teacher)
  // ===============================
  const endClass = async () => {
    await API.post(`/classroom/${classroomId}/end-live`);

    jitsiApiRef.current?.executeCommand("hangup");
    jitsiApiRef.current?.dispose();
    jitsiApiRef.current = null;

    navigate("/teacher");
  };

  return (
    <div className="live-class-page">
      {/* Top Bar */}
      <div className="live-header">
        <div>
          <h2>Live Class</h2>
          <span className="live-badge">LIVE</span>
        </div>

        {user?.role === "teacher" && isLive && (
          <button className="end-btn" onClick={endClass}>
            End Class
          </button>
        )}
      </div>

      {/* Video Section */}
      <div className="video-container">
        <div ref={jitsiContainerRef} className="jitsi-frame" />
      </div>
    </div>
  );
}

export default LiveClass;