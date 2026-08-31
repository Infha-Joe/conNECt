import { Link, useLocation } from "react-router-dom";
import { FiHome, FiUsers, FiCompass, FiCalendar, FiMessageSquare, FiBell, FiSettings, FiLogOut, FiBriefcase } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { icon: FiHome, label: "Home", path: "/dashboard" },
  { icon: FiUsers, label: "Network", path: "#" }, 
  { icon: FiCompass, label: "Explore", path: "#" }, 
  { icon: FiCalendar, label: "Events", path: "#" }, 
  { icon: FiBriefcase, label: "Mentorship", path: "/mentorship" }, 
  { icon: FiMessageSquare, label: "Messages", path: "#" }, 
  { icon: FiBell, label: "Notifications", path: "#" }, 
];

const LeftSidebar = () => {
  const { logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-full flex-col">
      {/* Main Navigation Group */}
      <nav className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`flex items-center gap-4 px-4 py-3 text-sm font-medium transition-colors ${
              isActive(item.path)
                ? "text-brand border-l-2 border-brand font-semibold"
                : "text-slate-500 border-l-2 border-transparent hover:text-ink hover:bg-slate-50"
            }`}
          >
            <item.icon size={20} className={isActive(item.path) ? "text-brand" : "text-slate-500"} />
            <span className="hidden lg:block">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Settings & Logout separated by subtle divider */}
      <nav className="mt-6 pt-4 border-t border-slate-200 space-y-1">
        <Link
          to="#"
          className="flex items-center gap-4 px-4 py-3 text-sm font-medium text-slate-500 border-l-2 border-transparent hover:text-ink hover:bg-slate-50 transition-colors"
        >
          <FiSettings size={20} className="text-slate-500" />
          <span className="hidden lg:block">Settings</span>
        </Link>
        <button
          onClick={logout}
          className="flex w-full items-center gap-4 px-4 py-3 text-sm font-medium text-slate-500 border-l-2 border-transparent hover:text-red-600 hover:bg-red-50 transition-colors text-left"
        >
          <FiLogOut size={20} className="text-slate-500 group-hover:text-red-600" />
          <span className="hidden lg:block">Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default LeftSidebar;
