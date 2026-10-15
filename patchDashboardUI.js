import fs from 'fs';
let content = fs.readFileSync('client/src/pages/UnifiedDashboard.jsx', 'utf8');

// We need to clean up UnifiedDashboard.jsx to remove My Posts / Campus Feed duplicate entirely.

const cleanComponent = `import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../layouts/DashboardLayout";
import { FiEdit3 } from "react-icons/fi";
import Avatar from "../components/ui/Avatar";

const UnifiedDashboard = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="w-full flex flex-col">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-10">
          <div className="flex items-center gap-5">
            <Avatar name={user?.name} src={user?.profilePhoto} className="w-20 h-20 text-2xl shrink-0 shadow-sm border border-border" />
            <div>
              <h1 className="text-3xl lg:text-4xl font-display font-bold text-ink tracking-tight mb-1">{user?.name}</h1>
              <p className="text-primary font-semibold tracking-wide text-sm mb-2">
                {user?.role === "student" ? "Student" : user?.role === "alumni" ? "Alumni" : user?.role === "teacher" ? "Faculty" : user?.role} 
                {user?.department?.name ? \`   \${user?.department?.name}\` : ""}
              </p>
              <p className="text-ink-light text-sm max-w-2xl">
                {user?.bio || "No bio added yet."}
              </p>
            </div>
          </div>
          
          <div className="hidden sm:block shrink-0">
            <button className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-md text-sm font-semibold text-ink hover:bg-background transition-colors shadow-sm">
              <FiEdit3 size={16} /> Edit Profile
            </button>
          </div>
        </div>

        {/* Future Dashboard Widgets can be placed here, naturally aligned left */}
        <div className="w-full">
          {/* Main dashboard content placeholder for any future widgets */}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default UnifiedDashboard;`;

fs.writeFileSync('client/src/pages/UnifiedDashboard.jsx', cleanComponent);
console.log("Cleaned UnifiedDashboard.jsx");
