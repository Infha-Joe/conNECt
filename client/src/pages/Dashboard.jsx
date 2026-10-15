import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import StudentDashboard from "./StudentDashboard";
import FacultyDashboard from "./FacultyDashboard";
import AlumniDashboard from "./AlumniDashboard";
import DebugErrorBoundary from "../components/DebugErrorBoundary";

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) return <Navigate to="/login" replace />;

  if (user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  if (user.role === "teacher" || user.role === "faculty") {
    return (
      <DebugErrorBoundary>
        <FacultyDashboard />
      </DebugErrorBoundary>
    );
  }

  if (user.role === "alumni") {
    return (
      <DebugErrorBoundary>
        <AlumniDashboard />
      </DebugErrorBoundary>
    );
  }

  return (
    <DebugErrorBoundary>
      <StudentDashboard />
    </DebugErrorBoundary>
  );
};

export default Dashboard;
