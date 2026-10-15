import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";
import { FiVideo, FiCalendar, FiClock, FiLink } from "react-icons/fi";

const VideoClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const { data } = await api.get('/mentorship/user/classes');
      setClasses(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const now = new Date();
  const upcoming = classes.filter(c => new Date(c.scheduledAt) >= now);
  const past = classes.filter(c => new Date(c.scheduledAt) < now);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink font-display">Video Classes & Sessions</h1>
        <p className="text-slate-500 mt-1">Manage your upcoming mentorship classes and review past sessions.</p>
      </div>

      <div className="space-y-8">
        {loading ? (
           <div className="animate-pulse flex space-x-4">
             <div className="flex-1 space-y-4 py-1">
               <div className="h-4 bg-slate-200 rounded w-3/4"></div>
               <div className="space-y-2">
                 <div className="h-4 bg-slate-200 rounded"></div>
                 <div className="h-4 bg-slate-200 rounded w-5/6"></div>
               </div>
             </div>
           </div>
        ) : (
          <>
            <section>
              <h2 className="text-lg font-bold text-ink mb-4 flex items-center gap-2">
                <FiCalendar className="text-brand" /> Upcoming Sessions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcoming.length > 0 ? upcoming.map(c => (
                  <div key={c._id} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-brand text-white"></div>
                    <h3 className="font-bold text-ink mb-2 pr-8">{c.title}</h3>
                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                      <span className="flex items-center gap-1"><FiCalendar /> {new Date(c.scheduledAt).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><FiClock /> {new Date(c.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    {c.meetingLink ? (
                      <a href={c.meetingLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-white bg-brand hover:bg-brand-dark px-4 py-2 rounded-xl transition-colors">
                        <FiVideo /> Join Session
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400 italic">No link provided yet</span>
                    )}
                  </div>
                )) : (
                  <div className="col-span-full py-8 text-center bg-slate-50 rounded-xl border border-slate-100 text-slate-500 text-sm">
                    No upcoming sessions scheduled.
                  </div>
                )}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-ink mb-4 flex items-center gap-2">
                <FiClock className="text-slate-400" /> Past Sessions
              </h2>
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                {past.length > 0 ? past.map(c => (
                  <div key={c._id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                    <div>
                      <h4 className="font-bold text-ink text-sm">{c.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">Hosted by {c.mentor?.name}</p>
                    </div>
                    <div className="text-right">
                       <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full whitespace-nowrap">
                         {new Date(c.scheduledAt).toLocaleDateString()}
                       </span>
                    </div>
                  </div>
                )) : (
                  <div className="p-8 text-center text-slate-500 text-sm">
                    No past sessions found.
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default VideoClasses;
