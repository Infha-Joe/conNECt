import { Routes, Route, Navigate } from "react-router-dom";
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

function App() {
  const [showAnimation, setShowAnimation] = useState(() => {
    // Only show animation once per session
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
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
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
          <ProtectedRoute>
            <CommunityHub />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clubs"
        element={
          <ProtectedRoute>
            <Clubs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clubs/:id"
        element={
          <ProtectedRoute>
            <ClubDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/gamification"
        element={
          <ProtectedRoute>
            <Gamification />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
