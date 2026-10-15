import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import CreatePostPage from "./pages/CreatePostPage";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import OpeningAnimation from "./components/OpeningAnimation";
import MentorshipHub from "./pages/MentorshipHub";
import ActiveMentorship from "./pages/ActiveMentorship";
import CommunityHub from "./pages/CommunityHub";
import AdminDashboard from "./pages/AdminDashboard";
import HelpRequests from "./pages/HelpRequests";
import Notifications from "./pages/Notifications";
import Network from "./pages/Network";
import NetworkFeed from "./pages/NetworkFeed";
import SinglePostView from "./pages/SinglePostView";
import Messages from "./pages/Messages";
import VerifyEmail from "./pages/VerifyEmail";
import DebugErrorBoundary from "./components/DebugErrorBoundary";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import ProjectDetail from "./pages/ProjectDetail";
import AcademicDashboard from "./pages/academic/AcademicDashboard";
import AlumniMemories from "./pages/AlumniMemories";
import VideoClasses from "./pages/VideoClasses";
import Workspace from "./pages/Workspace";
import MentorRequests from "./pages/MentorRequests";

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
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email/:token" element={<DebugErrorBoundary><VerifyEmail /></DebugErrorBoundary>} />
      <Route path="/verify-email" element={<DebugErrorBoundary><VerifyEmail /></DebugErrorBoundary>} />
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
      <Route path="/explore" element={<Navigate to="/network" replace />} />
      <Route path="/network" element={<ProtectedRoute><Network /></ProtectedRoute>} />
      <Route path="/post/:id" element={<ProtectedRoute><SinglePostView /></ProtectedRoute>} />
      <Route path="/create-post" element={<ProtectedRoute><CreatePostPage /></ProtectedRoute>} />
      <Route path="/network-feed" element={<ProtectedRoute><NetworkFeed /></ProtectedRoute>} />
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
      <Route path="/help-requests" element={<ProtectedRoute allowedRoles={["student", "teacher", "admin"]}><HelpRequests /></ProtectedRoute>}
      />
      <Route path="/academic" element={<ProtectedRoute allowedRoles={["student", "teacher", "admin"]}><AcademicDashboard /></ProtectedRoute>}
      />
      <Route path="/academic/classes/:id" element={<ProtectedRoute allowedRoles={["student", "teacher", "admin"]}><ClassView /></ProtectedRoute>}
      />
      <Route path="/projects" element={<Navigate to="/mentorship" replace />} />
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

      <Route path="/memories" element={<ProtectedRoute allowedRoles={["alumni", "admin"]}><AlumniMemories /></ProtectedRoute>} />
      <Route path="/video-classes" element={<ProtectedRoute allowedRoles={["alumni", "admin"]}><VideoClasses /></ProtectedRoute>} />
      <Route path="/faculty/students" element={<ProtectedRoute allowedRoles={["teacher", "admin"]}><FacultyStudents /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
