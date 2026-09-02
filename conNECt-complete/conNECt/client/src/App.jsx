import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Feed from "./pages/Feed";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";
import Clubs from "./pages/Clubs";
import ClubDetail from "./pages/ClubDetail";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Calendar from "./pages/Calendar";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import MentorRequests from "./pages/MentorRequests";
import Workspace from "./pages/Workspace";
import CommunityHub from "./pages/CommunityHub";
import Gamification from "./pages/Gamification";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
      <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
      <Route path="/profile/:id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/clubs" element={<ProtectedRoute><Clubs /></ProtectedRoute>} />
      <Route path="/clubs/:id" element={<ProtectedRoute><ClubDetail /></ProtectedRoute>} />
      <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
      <Route path="/events/:id" element={<ProtectedRoute><EventDetail /></ProtectedRoute>} />
      <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
      <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
      <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
      <Route path="/mentor-requests" element={<ProtectedRoute allowedRoles={["teacher", "alumni"]}><MentorRequests /></ProtectedRoute>} />
      <Route path="/workspaces/:id" element={<ProtectedRoute><Workspace /></ProtectedRoute>} />
      <Route path="/community" element={<ProtectedRoute><CommunityHub /></ProtectedRoute>} />
      <Route path="/achievements" element={<ProtectedRoute><Gamification /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
