import { Link, useLocation } from "react-router-dom";
import { Home, Search, Users, CalendarDays, PartyPopper, FolderGit2, GraduationCap, Sparkles, Award } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "../components/NotificationBell";

const baseNavItems = [
  { to: "/dashboard", label: "Feed", icon: Home },
  { to: "/explore", label: "Explore", icon: Search },
  { to: "/clubs", label: "Clubs", icon: Users },
  { to: "/events", label: "Events", icon: PartyPopper },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/projects", label: "Projects", icon: FolderGit2 },
  { to: "/community", label: "Community", icon: Sparkles },
  { to: "/achievements", label: "Achievements", icon: Award },
];

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [...baseNavItems];
  if (user?.role === "teacher" || user?.role === "alumni") {
    navItems.push({ to: "/mentor-requests", label: "Mentoring", icon: GraduationCap });
  }

  return (
    <div className="min-h-screen bg-parchment">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-ink/10 bg-white px-6 py-3">
        <Link to="/dashboard" className="font-display text-xl tracking-tight text-ink">
          con<span className="text-brass">NEC</span>t
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                location.pathname === to ? "bg-ink/5 text-ink" : "text-slate-text hover:bg-ink/5 hover:text-ink"
              }`}>
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <NotificationBell />
          <Link to={`/profile/${user?._id}`} className="flex items-center gap-2 rounded-lg px-2 py-1 transition hover:bg-ink/5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink/5 font-display text-xs font-medium text-ink">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <span className="hidden text-sm text-ink sm:inline">{user?.name}</span>
          </Link>
          <button onClick={logout} className="rounded-lg border border-ink/15 px-3 py-1.5 text-sm font-medium text-ink transition hover:bg-ink/5">
            Log out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
};

export default DashboardLayout;
