const fs = require('fs');

const appJsxContent = `import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import OpeningAnimation from "./components/OpeningAnimation";
import MentorshipHub from "./pages/MentorshipHub";
import ActiveMentorship from "./pages/ActiveMentorship";
import CommunityHub from "./pages/CommunityHub";
import Clubs from "./pages/Clubs";
import ClubDetail from "./pages/ClubDetail";
import Gamification from "./pages/Gamification";
import AdminDashboard from "./pages/AdminDashboard";
import HelpRequests from "./pages/HelpRequests";
import Notifications from "./pages/Notifications";
import Explore from "./pages/Explore";
import Network from "./pages/Network";
import Messages from "./pages/Messages";
import VerifyEmail from "./pages/VerifyEmail";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import AcademicDashboard from "./pages/academic/AcademicDashboard";
import AlumniMemories from "./pages/AlumniMemories";
import VideoClasses from "./pages/VideoClasses";
import Workspace from "./pages/Workspace";
import MentorRequests from "./pages/MentorRequests";
import Calendar from "./pages/Calendar";

import FacultyStudents from "./pages/FacultyStudents";
import ClassView from "./pages/academic/ClassView";

function App() {
  const [showAnimation, setShowAnimation] = useState(() => {
    const hasSeenAnimation = sessionStorage.getItem("hasSeenAnimation");
    return !hasSeenAnimation;
  });

  const handleAnimationComplete = () => {
    sessionStorage.setItem("hasSeenAnimation", "true");
    setShowAnimation(false);
  };

  if (showAnimation) {
    return <OpeningAnimation onComplete={handleAnimationComplete} />;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/explore"
        element={
          <ProtectedRoute allowedRoles={["student", "teacher", "admin"]}>
            <Explore />
          </ProtectedRoute>
        }
      />
      <Route path="/network" element={<ProtectedRoute><Network /></ProtectedRoute>} />
      <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/:id"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentorship"
        element={
          <ProtectedRoute>
            <MentorshipHub />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentorship/:id"
        element={
          <ProtectedRoute>
            <ActiveMentorship />
          </ProtectedRoute>
        }
      />
      <Route
        path="/community"
        element={
          <ProtectedRoute allowedRoles={["student", "teacher", "admin"]}>
            <CommunityHub />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clubs"
        element={
          <ProtectedRoute allowedRoles={["student", "teacher", "admin"]}>
            <Clubs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clubs/:id"
        element={
          <ProtectedRoute allowedRoles={["student", "teacher", "admin"]}>
            <ClubDetail />
          </ProtectedRoute>
        }
      />
      <Route path="/gamification" element={<ProtectedRoute allowedRoles={["student", "admin"]}><Gamification /></ProtectedRoute>}
      />
      <Route path="/help-requests" element={<ProtectedRoute allowedRoles={["student", "teacher", "admin"]}><HelpRequests /></ProtectedRoute>}
      />
      <Route path="/academic" element={<ProtectedRoute allowedRoles={["student", "teacher", "admin"]}><AcademicDashboard /></ProtectedRoute>}
      />
      <Route path="/academic/classes/:id" element={<ProtectedRoute allowedRoles={["student", "teacher", "admin"]}><ClassView /></ProtectedRoute>}
      />
      <Route
        path="/events"
        element={
          <ProtectedRoute allowedRoles={["student", "teacher", "admin"]}>
            <Events />
          </ProtectedRoute>
        }
      />
      <Route
        path="/events/:id"
        element={
          <ProtectedRoute allowedRoles={["student", "teacher", "admin"]}>
            <EventDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <Projects />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/:id"
        element={
          <ProtectedRoute>
            <ProjectDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />
      
      <Route path="/workspaces/:id" element={<ProtectedRoute><Workspace /></ProtectedRoute>} />
      <Route path="/mentor-requests" element={<ProtectedRoute><MentorRequests /></ProtectedRoute>} />
      <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />

      <Route path="/memories" element={<ProtectedRoute allowedRoles={["alumni", "admin"]}><AlumniMemories /></ProtectedRoute>} />
      <Route path="/video-classes" element={<ProtectedRoute allowedRoles={["alumni", "admin"]}><VideoClasses /></ProtectedRoute>} />
      <Route path="/faculty/students" element={<ProtectedRoute allowedRoles={["teacher", "admin"]}><FacultyStudents /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
`;

fs.writeFileSync('client/src/App.jsx', appJsxContent);
console.log("Restored App.jsx with Network and Messages routes properly configured!");
