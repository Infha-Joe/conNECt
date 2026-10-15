import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";

const MentorRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [respondingId, setRespondingId] = useState(null);
  const [duration, setDuration] = useState("8");
  const [meetingLink, setMeetingLink] = useState("");

  const load = async () => {
    setLoading(true);
    const { data } = await api.get("/mentor-requests", { params: { type: "received" } });
    setRequests(data.requests);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const respond = async (id, action) => {
    await api.put(`/mentor-requests/${id}/respond`, { action, durationWeeks: duration, meetingLink });
    setRespondingId(null);
    load();
  };

  return (
    <DashboardLayout>
      <div className="w-full">
        <h1 className="font-display text-2xl font-medium text-ink">Mentor Requests</h1>
        <div className="mt-6 space-y-3">
          {loading && (<div className="flex justify-center py-10"><div className="h-6 w-6 animate-spin rounded-full border-2 border-ink/20 border-t-brass" /></div>)}
          {!loading && requests.length === 0 && <p className="py-10 text-center text-sm text-slate-text">No mentor requests yet.</p>}
          {requests.map((r) => (
            <div key={r._id} className="rounded-xl border border-ink/10 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-ink">
                    <Link to={`/profile/${r.student._id}`} className="hover:underline">{r.student.name}</Link> → <span className="text-ink">{r.project.title}</span>
                  </p>
                  <p className="mt-1 text-sm text-ink">{r.message}</p>
                  {r.requestedDuration && <p className="mt-1 text-xs text-slate-text">Requested duration: {r.requestedDuration}</p>}
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${r.status === "pending" ? "bg-brass/10 text-brass-dark" : r.status === "accepted" ? "bg-sage/10 text-sage" : "bg-slate-text/10 text-slate-text"}`}>{r.status}</span>
              </div>

              {r.status === "pending" && (
                <div className="mt-3 border-t border-ink/5 pt-3">
                  {respondingId === r._id ? (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input type="number" min={1} value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Weeks"
                          className="w-24 rounded-lg border border-ink/15 px-3 py-1.5 text-sm outline-none focus:border-brass" />
                        <input value={meetingLink} onChange={(e) => setMeetingLink(e.target.value)} placeholder="Meeting link (optional)"
                          className="flex-1 rounded-lg border border-ink/15 px-3 py-1.5 text-sm outline-none focus:border-brass" />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => respond(r._id, "accept")} className="rounded-lg bg-ink px-4 py-1.5 text-sm font-semibold text-parchment hover:bg-ink-light">Confirm accept</button>
                        <button onClick={() => setRespondingId(null)} className="rounded-lg border border-ink/15 px-4 py-1.5 text-sm font-medium text-ink hover:bg-ink/5">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={() => setRespondingId(r._id)} className="rounded-lg bg-ink px-4 py-1.5 text-sm font-semibold text-parchment hover:bg-ink-light">Accept</button>
                      <button onClick={() => respond(r._id, "reject")} className="rounded-lg border border-ink/15 px-4 py-1.5 text-sm font-medium text-ink hover:bg-ink/5">Reject</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MentorRequests;
