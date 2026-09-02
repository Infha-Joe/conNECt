import { useState } from "react";
import { Navigate } from "react-router-dom";
import { LayoutDashboard, Users, Building2, ShieldAlert } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import AdminOverviewTab from "../components/AdminOverviewTab";
import AdminUsersTab from "../components/AdminUsersTab";
import AdminDepartmentsTab from "../components/AdminDepartmentsTab";
import AdminModerationTab from "../components/AdminModerationTab";
import { useAuth } from "../context/AuthContext";

const tabs = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "departments", label: "Departments", icon: Building2 },
  { id: "moderation", label: "Moderation", icon: ShieldAlert },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useAuth();

  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-2xl font-medium text-ink">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-slate-text">Platform management, users, departments, and moderation.</p>

        <div className="mt-6 flex gap-1 rounded-lg border border-ink/10 bg-white p-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-xs font-medium transition sm:text-sm ${
                activeTab === id ? "bg-ink text-parchment" : "text-slate-text hover:bg-ink/5 hover:text-ink"
              }`}
            >
              <Icon size={15} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        <div className="mt-5">
          {activeTab === "overview" && <AdminOverviewTab />}
          {activeTab === "users" && <AdminUsersTab />}
          {activeTab === "departments" && <AdminDepartmentsTab />}
          {activeTab === "moderation" && <AdminModerationTab />}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
