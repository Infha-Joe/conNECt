import { useAuth } from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { FiHome, FiUser, FiSearch, FiBell, FiMenu, FiX, FiSettings, FiCompass } from "react-icons/fi";
import LeftSidebar from "../components/layout/LeftSidebar";
import Avatar from "../components/ui/Avatar";
import NotificationDropdown from "../components/layout/NotificationDropdown";
import { useState, useEffect } from "react";

const DashboardLayout = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="grid h-screen w-full lg:grid-cols-[280px_minmax(0,1fr)] bg-background font-sans overflow-hidden text-ink">
      
      {/* 
        ========================================================
        APPLICATION SIDEBAR
        Inspired by Goat Funded & modern platforms
        Stable 280px width, integrated feel, deep background
        ========================================================
      */}
      <aside className="hidden lg:flex flex-col h-full bg-surface border-r border-border z-20">
        {/* LOGO AREA */}
        <div className="px-8 pt-8 pb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-primary flex items-center justify-center text-white font-bold text-lg shadow-sm">
            C
          </div>
          <span className="font-display text-2xl font-bold tracking-tight text-ink">
            con<span className="text-primary">NEC</span>t
          </span>
        </div>
        
        {/* NAVIGATION RAIL */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <LeftSidebar />
        </div>
      </aside>

      {/* 
        ========================================================
        MAIN APPLICATION SHELL
        Uses 1fr properly to fill the remaining screen space
        ========================================================
      */}
      <div className="flex flex-col h-full min-w-0 overflow-y-auto relative bg-background" id="main-scroll">
        
        {/* TOP BAR */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 lg:px-10 py-4 bg-background/95 backdrop-blur-md border-b border-border">
          
          {/* Mobile Toggle & Logo */}
          <div className="flex items-center gap-4 lg:hidden">
            <button onClick={() => setMobileMenuOpen(true)} className="text-ink hover:text-primary transition-colors">
              <FiMenu size={24} />
            </button>
            <span className="font-display text-xl font-bold text-ink">con<span className="text-primary">NEC</span>t</span>
          </div>

          

          {/* Right Controls */}
          <div className="flex items-center gap-5 ml-auto">
            <NotificationDropdown />
            
            <Link to="/profile" className="hidden lg:flex items-center gap-3 hover:opacity-80 transition-opacity pl-4 border-l border-border">
              <Avatar src={user?.profilePhoto} name={user?.name} className="w-10 h-10 border border-border shadow-sm" />
              <div className="hidden xl:block text-left">
                <p className="text-sm font-bold text-ink leading-tight">{user?.name}</p>
                <p className="text-xs text-ink-light font-medium capitalize">{user?.role}</p>
              </div>
            </Link>
          </div>
        </header>

        {/* 
          ========================================================
          PAGE CONTENT CONTAINER
          Intelligently uses viewport width (max-w-7xl = 1280px)
          Eliminates the "huge empty right side"
          ========================================================
        */}
        <main className="flex-1 w-full max-w-[1200px] px-6 lg:px-10 py-8">
          {children}
        </main>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-ink/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="absolute top-0 left-0 bottom-0 w-[300px] bg-surface shadow-2xl flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 pb-2">
              <span className="font-display text-2xl font-bold tracking-tight text-ink">
                con<span className="text-primary">NEC</span>t
              </span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-ink hover:bg-background rounded-lg">
                <FiX size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-hide pt-4">
              <LeftSidebar />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex w-full justify-around border-t border-border bg-surface py-3 lg:hidden pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
         <Link to="/dashboard" className={`flex flex-col items-center gap-1.5 transition-colors ${isActive('/dashboard') ? 'text-primary' : 'text-ink-light'}`}>
            <FiHome size={22} />
            <span className="text-[10px] font-semibold">Home</span>
         </Link>
         {user?.role !== 'admin' && (
           <>
             <Link to="/network-feed" className={`flex flex-col items-center gap-1.5 transition-colors ${isActive('/network-feed') ? 'text-primary' : 'text-ink-light'}`}>
               <FiCompass size={22} />
               <span className="text-[10px] font-semibold">Feed</span>
             </Link>
             <Link to="/network" className={`flex flex-col items-center gap-1.5 transition-colors ${isActive('/network') ? 'text-primary' : 'text-ink-light'}`}>
               <FiSearch size={22} />
               <span className="text-[10px] font-semibold">Network</span>
             </Link>
           </>
         )}
         <Link to="/profile" className={`flex flex-col items-center gap-1.5 transition-colors ${isActive('/profile') ? 'text-primary' : 'text-ink-light'}`}>
            <FiUser size={22} />
            <span className="text-[10px] font-semibold">Profile</span>
         </Link>
      </nav>
    </div>
  );
};

export default DashboardLayout;
