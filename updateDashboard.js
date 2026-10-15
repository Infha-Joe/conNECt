import fs from 'fs';

const content = `import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { FiEdit3, FiPlus } from "react-icons/fi";
import Avatar from "../components/ui/Avatar";

const UnifiedDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

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
          
          <div className="flex flex-col gap-3 shrink-0 mt-4 sm:mt-0">
            <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-surface border border-border rounded-md text-sm font-bold text-ink hover:bg-background transition-colors shadow-sm">
              <FiEdit3 size={16} /> Edit Profile
            </button>
            <Link to="/create-post" className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-md text-sm font-bold shadow-sm hover:opacity-90 transition-opacity">
              <FiPlus size={16} /> Create a Post
            </Link>
          </div>
        </div>

        {/* Home Navigation Tabs */}
        <div className="flex w-full justify-between border-b border-border mb-10 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => navigate("/network-feed")}
            className="flex-1 pb-4 px-2 text-sm font-bold tracking-wide transition-all whitespace-nowrap border-b-[3px] border-primary text-primary text-center"
          >
            MY POSTS
          </button>
          <button
            onClick={() => navigate("/network")}
            className="flex-1 pb-4 px-2 text-sm font-bold tracking-wide transition-all whitespace-nowrap border-b-[3px] border-transparent text-ink-light hover:text-ink hover:border-border text-center"
          >
            FIND PEOPLE
          </button>
          <button
            onClick={() => navigate("/mentorship")}
            className="flex-1 pb-4 px-2 text-sm font-bold tracking-wide transition-all whitespace-nowrap border-b-[3px] border-transparent text-ink-light hover:text-ink hover:border-border text-center"
          >
            PROJECTS & MENTORSHIP
          </button>
        </div>

        {/* Future Dashboard Widgets can be placed here, naturally aligned left */}
        <div className="w-full">
          {/* Main dashboard content placeholder for any future widgets */}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default UnifiedDashboard;
`;

fs.writeFileSync('client/src/pages/UnifiedDashboard.jsx', content);
console.log("Rewrote UnifiedDashboard.jsx");
