import { Link } from "react-router-dom";
import { FiEdit3, FiUsers, FiBriefcase } from "react-icons/fi";

const HomeActionRow = ({ onCreatePostClick }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 mb-6 w-full">
      <button 
        onClick={onCreatePostClick}
        className="flex-1 w-full flex items-center justify-center gap-2 px-4 py-3 sm:py-2.5 rounded-xl sm:rounded-lg bg-white border border-slate-200 text-slate-600 hover:border-brand hover:text-brand hover:shadow-sm transition-all shadow-sm"
      >
        <FiEdit3 size={16} />
        <span className="text-sm font-semibold">Create Post</span>
      </button>

      <Link 
        to="/network"
        className="flex-1 w-full flex items-center justify-center gap-2 px-4 py-3 sm:py-2.5 rounded-xl sm:rounded-lg bg-white border border-slate-200 text-slate-600 hover:border-brand hover:text-brand hover:shadow-sm transition-all shadow-sm"
      >
        <FiUsers size={16} />
        <span className="text-sm font-semibold">Find People</span>
      </Link>

      <Link 
        to="/mentorship"
        className="flex-1 w-full flex items-center justify-center gap-2 px-4 py-3 sm:py-2.5 rounded-xl sm:rounded-lg bg-white border border-slate-200 text-slate-600 hover:border-brand hover:text-brand hover:shadow-sm transition-all shadow-sm"
      >
        <FiBriefcase size={16} />
        <span className="text-sm font-semibold">Projects & Mentorship</span>
      </Link>
    </div>
  );
};

export default HomeActionRow;
