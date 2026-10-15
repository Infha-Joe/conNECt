import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { FiClock, FiFileText, FiUsers, FiBriefcase } from "react-icons/fi";

const getIcon = (type) => {
  switch(type) {
    case 'mentorship': return <FiUsers className="text-blue-500" />;
    case 'project': return <FiBriefcase className="text-amber-500" />;
    default: return <FiFileText className="text-slate-400" />;
  }
}

const RecentlyAccessedWidget = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/recent")
      .then(res => setItems(res.data.recent || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6">
      <div className="flex items-center gap-2 mb-4 text-ink font-bold text-sm">
        <FiClock className="text-slate-400" />
        <h2>Recently Accessed</h2>
      </div>
      <div className="space-y-3">
        {loading ? (
          <p className="text-xs text-slate-400">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-xs text-slate-500">No recently accessed items yet.</p>
        ) : (
          items.map(item => (
            <Link key={item._id} to={item.link} className="flex items-center gap-3 group">
              <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-slate-100 transition-colors">
                {getIcon(item.resourceType)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink truncate group-hover:text-brand transition-colors">{item.title}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">{item.resourceType}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentlyAccessedWidget;
