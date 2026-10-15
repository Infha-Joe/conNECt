import { Link, useLocation } from "react-router-dom";
import { FiHome, FiMessageSquare, FiGlobe, FiUsers, FiCompass, FiCalendar, FiBell, FiSettings, FiLogOut, FiBriefcase, FiAward, FiShield, FiUser, FiLifeBuoy, FiBookOpen, FiVideo, FiArchive } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useBadges } from "../../context/BadgeContext";
import Avatar from "../ui/Avatar";

const studentNavItems = [
  { icon: FiHome, label: "Home", path: "/dashboard" },
  { icon: FiCompass, label: "Campus Feed", path: "/network-feed" },
  { icon: FiGlobe, label: "Network", path: "/network" },
  { icon: FiMessageSquare, label: "Messages", path: "/messages" },
  { icon: FiBookOpen, label: "Academic", path: "/academic" },
  { icon: FiBriefcase, label: "Projects & Mentorship", path: "/mentorship" },
  { icon: FiLifeBuoy, label: "Help Requests", path: "/help-requests" },
];

const teacherNavItems = [
  { icon: FiHome, label: "Home", path: "/dashboard" },
  { icon: FiCompass, label: "Campus Feed", path: "/network-feed" },
  { icon: FiGlobe, label: "Network", path: "/network" },
  { icon: FiMessageSquare, label: "Messages", path: "/messages" },
  { icon: FiArchive, label: "Academic", path: "/academic" },
  { icon: FiUsers, label: "Students", path: "/faculty/students" },
  { icon: FiBriefcase, label: "Projects & Mentorship", path: "/mentorship" },
];

const alumniNavItems = [
  { icon: FiHome, label: "Home", path: "/dashboard" },
  { icon: FiCompass, label: "Campus Feed", path: "/network-feed" },
  { icon: FiGlobe, label: "Network", path: "/network" },
  { icon: FiMessageSquare, label: "Messages", path: "/messages" },
  { icon: FiBriefcase, label: "Projects & Mentorship", path: "/mentorship" },
];

const LeftSidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { unreadMessages } = useBadges();

  const isActive = (path) => location.pathname === path;

  let currentNavItems = studentNavItems;
  if (user?.role === "alumni") currentNavItems = alumniNavItems;
  else if (user?.role === "teacher") currentNavItems = teacherNavItems;
  else if (user?.role === "admin") currentNavItems = [];

  const activeClasses = "text-primary font-bold bg-primary/5 border-l-2 border-primary";
  const inactiveClasses = "text-ink-light hover:text-ink hover:bg-surface border-l-2 border-transparent";

  return (
    <div className="flex h-full flex-col">
      <div className="mb-6 pl-6 text-[10px] font-bold tracking-widest text-ink-lighter uppercase">
        {user?.role === "alumni" ? "Alumni Portal" : user?.role === "teacher" ? "Faculty Portal" : "Student Portal"}
      </div>
      
      <nav className="flex-1 flex flex-col gap-1">
        {currentNavItems.map((item, i) => (
          <Link
            key={item.label + i}
            to={item.path}
            className={`flex items-center gap-4 pl-6 pr-4 py-2.5 text-[13px] transition-all ${
              isActive(item.path) ? activeClasses : inactiveClasses
            }`}
          >
            <item.icon size={16} className={isActive(item.path) ? "text-primary" : "text-ink-lighter"} />
            <span className="flex-1">{item.label}</span>
            {item.path === "/messages" && unreadMessages > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded bg-secondary px-1 text-[9px] font-bold text-white shadow-sm">
                {unreadMessages > 9 ? "9+" : unreadMessages}
              </span>
            )}
          </Link>
        ))}

        {user?.role === "admin" && (
          <Link
            to="/admin"
            className={`flex items-center gap-4 pl-6 pr-4 py-2.5 mt-2 text-[13px] transition-all ${
              isActive("/admin") ? "text-secondary font-bold bg-secondary/5 border-l-2 border-secondary" : inactiveClasses
            }`}
          >
            <FiShield size={16} className={isActive("/admin") ? "text-secondary" : "text-ink-lighter"} />
            <span>Admin Dashboard</span>
          </Link>
        )}
      </nav>

      {/* Profile & Settings block at bottom */}
      <div className="mt-auto pt-4 border-t border-border flex flex-col gap-1 pb-4">
        <Link
          to="/profile"
          className={`flex items-center gap-4 pl-6 pr-4 py-2.5 text-[13px] transition-all ${
            isActive("/profile") ? activeClasses : inactiveClasses
          }`}
        >
          <FiUser size={16} className={isActive("/profile") ? "text-primary" : "text-ink-lighter"} />
          <span>My Profile</span>
        </Link>
        <button onClick={logout} className="w-full flex items-center gap-4 pl-6 pr-4 py-2.5 text-[13px] transition-all text-ink-light hover:text-danger hover:bg-danger/5 border-l-2 border-transparent">
          <FiLogOut size={16} className="text-ink-lighter group-hover:text-danger" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default LeftSidebar;
