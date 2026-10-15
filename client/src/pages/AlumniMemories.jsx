import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";
import { FiAward, FiBriefcase, FiVideo, FiCalendar } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Skeleton from "../components/ui/Skeleton";

const AlumniMemories = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    try {
      const [projRes, classRes] = await Promise.all([
        api.get('/projects?mine=true'),
        api.get('/mentorship/user/classes').catch(() => ({ data: [] }))
      ]);
      setProjects(projRes.data.projects || projRes.data || []);
      setClasses(classRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink font-display">College Memories</h1>
        <p className="text-slate-500 mt-1">Your historical journey and contributions at National Engineering College.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-brand to-brand-dark p-6 rounded-2xl shadow-md text-white flex flex-col justify-between">
          <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <FiAward size={24} />
          </div>
          <div>
            <h3 className="text-3xl font-bold">{user?.streak || 0}</h3>
            <p className="text-sm font-medium text-white/80">Total XP / Badges Earned</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="bg-blue-50 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <FiBriefcase size={24} />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-ink">{projects.length}</h3>
            <p className="text-sm font-medium text-slate-500">Projects Completed</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="bg-green-50 text-green-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <FiVideo size={24} />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-ink">{classes.length}</h3>
            <p className="text-sm font-medium text-slate-500">Mentorship Sessions</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-6">
           <Skeleton type="line" className="w-full h-32" />
           <Skeleton type="line" className="w-full h-32" />
        </div>
      ) : (
        <div className="space-y-8">
          <section>
            <h2 className="text-lg font-bold text-ink mb-4 flex items-center gap-2">
              <FiBriefcase className="text-slate-400" /> Historical Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.length > 0 ? projects.map(p => (
                <div key={p._id} className="bg-white border border-slate-200 p-5 rounded-xl hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-ink mb-1 truncate">{p.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-3">{p.description}</p>
                  <Link to={`/projects/${p._id}`} className="text-xs font-bold text-brand hover:underline">View Archive &rarr;</Link>
                </div>
              )) : (
                <div className="col-span-full py-8 text-center bg-slate-50 rounded-xl border border-slate-100 text-slate-500 text-sm">
                  No historical projects found on conNECt.
                </div>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink mb-4 flex items-center gap-2">
              <FiCalendar className="text-slate-400" /> Mentorship Timeline
            </h2>
            <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
              {classes.length > 0 ? classes.map(c => (
                <div key={c._id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-ink text-sm">{c.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">With {c.mentor?.name || 'Mentor'}</p>
                  </div>
                  <div className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    {new Date(c.scheduledAt).toLocaleDateString()}
                  </div>
                </div>
              )) : (
                <div className="p-8 text-center text-slate-500 text-sm">
                  No mentorship sessions recorded in your history.
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AlumniMemories;
