import { useAuth } from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { FiHome, FiUser, FiSearch, FiBell } from "react-icons/fi";
import LeftSidebar from "../components/layout/LeftSidebar";
import RightSidebar from "../components/layout/RightSidebar";
import Avatar from "../components/ui/Avatar";

const DashboardLayout = ({ children, hideRightSidebar = false }) => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col relative">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex h-14 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          
          {/* Logo */}
          <Link to="/dashboard" className="font-display text-xl sm:text-2xl font-bold tracking-tight text-ink transition hover:opacity-80 w-20 lg:w-64 shrink-0">
            con<span className="text-brand">NEC</span>t
          </Link>

          {/* Desktop Search - Integrated seamlessly */}
          <div className="hidden md:flex flex-1 max-w-md relative ml-4">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Search for people, clubs, events..." 
              className="w-full bg-slate-50 border-none rounded-md py-1.5 pl-9 pr-4 text-sm text-ink outline-none focus:bg-white focus:ring-1 focus:ring-brand transition-all"
            />
          </div>
          
          {/* Desktop Right Actions */}
          <div className="hidden md:flex ml-auto items-center gap-5">
            <button className="text-slate-500 hover:text-ink transition-colors relative">
              <FiBell size={20} />
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500 border border-white"></span>
            </button>
            <Link to="/profile">
              <Avatar name={user?.name} size="sm" className="hover:ring-2 hover:ring-brand/20 transition-all cursor-pointer" />
            </Link>
          </div>

          {/* Mobile Right Actions */}
          <div className="flex md:hidden ml-auto items-center gap-4 text-ink">
            <FiSearch size={20} />
            <FiBell size={20} />
          </div>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 pb-20 md:pb-0">
        
        {/* Left Sidebar (Desktop & Tablet) */}
        <aside className="hidden md:block w-20 lg:w-64 shrink-0 pt-6 pr-6 lg:pr-8">
          <div className="sticky top-20">
            <LeftSidebar />
          </div>
        </aside>

        {/* Center Primary Content */}
        <main className={`flex-1 pt-6 ${hideRightSidebar ? 'max-w-4xl mx-auto w-full' : 'max-w-[600px] mx-auto lg:max-w-[680px]'}`}>
          {children}
        </main>

        {/* Right Sidebar (Desktop only) */}
        {!hideRightSidebar && (
          <aside className="hidden lg:block w-72 shrink-0 pt-6 pl-8 ml-8 border-l border-slate-200">
            <div className="sticky top-20">
              <RightSidebar />
            </div>
          </aside>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 z-40 flex w-full justify-around border-t border-slate-200 bg-white py-3 md:hidden">
        <Link 
          to="/dashboard" 
          className={`flex flex-col items-center gap-1 ${isActive('/dashboard') ? 'text-brand' : 'text-slate-500'}`}
        >
          <FiHome size={22} />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link 
          to="/profile" 
          className={`flex flex-col items-center gap-1 ${isActive('/profile') ? 'text-brand' : 'text-slate-500'}`}
        >
          <FiUser size={22} />
          <span className="text-[10px] font-medium">Profile</span>
        </Link>
      </nav>
    </div>
  );
};

export default DashboardLayout;
