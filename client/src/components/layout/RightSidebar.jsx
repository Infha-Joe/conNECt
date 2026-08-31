import EmptyState from "../ui/EmptyState";
import { FiTrendingUp, FiUsers } from "react-icons/fi";

const RightSidebar = () => {
  return (
    <div className="flex h-full flex-col gap-8 pt-4">
      {/* Contextual Suggestions / Placeholders for future modules */}
      <div>
        <h3 className="mb-3 text-xs uppercase tracking-wider font-semibold text-slate-500 flex items-center gap-2">
          Trending at NEC
        </h3>
        <EmptyState 
          compact
          icon={FiTrendingUp} 
          title="No trends yet" 
          description="Trending topics will appear here." 
        />
      </div>

      <div>
        <h3 className="mb-3 text-xs uppercase tracking-wider font-semibold text-slate-500 flex items-center gap-2">
          Suggested Connections
        </h3>
        <EmptyState 
          compact
          icon={FiUsers} 
          title="No suggestions" 
          description="Build your network to see suggestions." 
        />
      </div>
      
      <div className="pt-6 border-t border-slate-200 text-xs text-slate-500/70">
        <p>conNECt © {new Date().getFullYear()}</p>
        <div className="flex gap-3 mt-2">
          <a href="#" className="hover:underline">About</a>
          <a href="#" className="hover:underline">Help Center</a>
          <a href="#" className="hover:underline">Privacy</a>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
