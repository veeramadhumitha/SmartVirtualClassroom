import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import ProtectedRoute from "./components/ProtectedRoute";

// Dashboards
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";

// Classroom
import CreateClassroom from "./pages/CreateClassroom";
import TeacherClassroom from "./pages/TeacherClassroom";

// Notes
import UploadNotes from "./pages/UploadNotes";
import ViewNotes from "./pages/ViewNotes";

// Tests
import CreateTest from "./pages/CreateTest";
import ViewTests from "./pages/ViewTests";
import TakeTest from "./pages/TakeTest";
import TeacherTests from "./pages/TeacherTests";

// Attendance & Live
import TeacherAttendance from "./pages/TeacherAttendance";
import LiveClass from "./pages/LiveClass";

// Progress / Results
import StudentResults from "./pages/StudentResults";
import TeacherProgress from "./pages/TeacherProgress";
import TeacherTestProgress from "./pages/TeacherTestProgress";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* TEACHER */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute role="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/create-classroom"
          element={
            <ProtectedRoute role="teacher">
              <CreateClassroom />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/classroom/:classroomId"
          element={
            <ProtectedRoute role="teacher">
              <TeacherClassroom />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/upload/:classroomId"
          element={
            <ProtectedRoute role="teacher">
              <UploadNotes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/test/:classroomId"
          element={
            <ProtectedRoute role="teacher">
              <CreateTest />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/classroom/:classroomId/tests"
          element={
            <ProtectedRoute role="teacher">
              <TeacherTests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/classroom/:classroomId/attendance"
          element={
            <ProtectedRoute role="teacher">
              <TeacherAttendance />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/classroom/:classroomId/progress"
          element={
            <ProtectedRoute role="teacher">
              <TeacherProgress />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/classroom/:classroomId/test/:testId/progress"
          element={
            <ProtectedRoute role="teacher">
              <TeacherTestProgress />
            </ProtectedRoute>
          }
        />

        {/* STUDENT */}
        <Route
          path="/student"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/notes/:classroomId"
          element={
            <ProtectedRoute role="student">
              <ViewNotes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/tests/:classroomId"
          element={
            <ProtectedRoute role="student">
              <ViewTests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/test/:testId"
          element={
            <ProtectedRoute role="student">
              <TakeTest />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/results"
          element={
            <ProtectedRoute role="student">
              <StudentResults />
            </ProtectedRoute>
          }
        />

        {/* LIVE CLASS */}
        <Route
          path="/classroom/:classroomId/live"
          element={<LiveClass />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;