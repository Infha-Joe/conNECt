import { useState, useEffect } from "react";
import { Trophy, Plus } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const LeaderboardTab = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", departments: [], startDate: "", endDate: "", points: 100 });
  const { user } = useAuth();

  const load = async () => {
    setLoading(true);
    const [lbRes, chRes, deptRes] = await Promise.all([
      api.get("/departments/leaderboard"),
      api.get("/challenges"),
      api.get("/departments"),
    ]);
    setLeaderboard(lbRes.data.leaderboard);
    setChallenges(chRes.data.challenges);
    setDepartments(deptRes.data.departments);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggleDept = (id) => {
    setForm((prev) => ({
      ...prev,
      departments: prev.departments.includes(id) ? prev.departments.filter((d) => d !== id) : [...prev.departments, id],
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.post("/challenges", form);
    setForm({ title: "", description: "", departments: [], startDate: "", endDate: "", points: 100 });
    setShowCreate(false);
    load();
  };

  const declareWinner = async (challengeId, departmentId) => {
    await api.put(`/challenges/${challengeId}/winner`, { departmentId });
    load();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-ink/20 border-t-brass" />
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-xl border border-ink/10 bg-white p-4">
        <p className="mb-3 text-sm font-semibold text-ink">Department Leaderboard</p>
        <div className="space-y-2">
          {leaderboard.map((entry, i) => (
            <div key={entry.department._id} className="flex items-center justify-between rounded-lg border border-ink/5 p-3">
              <div className="flex items-center gap-3">
                <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${i === 0 ? "bg-brass text-ink" : "bg-ink/5 text-slate-text"}`}>
                  {i + 1}
                </span>
                <span className="text-sm font-medium text-ink">{entry.department.name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-text">
                {i === 0 && entry.totalPoints > 0 && <Trophy size={14} className="text-brass-dark" />}
                <span className="font-semibold text-ink">{entry.totalPoints} pts</span>
                <span className="text-xs">({entry.challengesWon} won)</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm font-semibold text-ink">Challenges</p>
        {user?.role === "admin" && (
          <button onClick={() => setShowCreate((s) => !s)} className="flex items-center gap-1.5 rounded-lg bg-ink px-3 py-1.5 text-sm font-semibold text-parchment hover:bg-ink-light">
            <Plus size={14} /> New challenge
          </button>
        )}
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="mt-3 space-y-3 rounded-xl border border-ink/10 bg-white p-4">
          <input required value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="Challenge title"
            className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-brass" />
          <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="Description" rows={2}
            className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-brass" />
          <div className="flex flex-wrap gap-2">
            {departments.map((d) => (
              <button type="button" key={d._id} onClick={() => toggleDept(d._id)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${form.departments.includes(d._id) ? "border-brass bg-brass/10 text-ink" : "border-ink/15 text-slate-text"}`}>
                {d.name}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            <input required type="date" value={form.startDate} onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
              className="rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-brass" />
            <input required type="date" value={form.endDate} onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
              className="rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-brass" />
            <input type="number" value={form.points} onChange={(e) => setForm((p) => ({ ...p, points: e.target.value }))} placeholder="Points"
              className="rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-brass" />
          </div>
          <button type="submit" className="rounded-lg bg-ink px-4 py-1.5 text-sm font-semibold text-parchment hover:bg-ink-light">Create challenge</button>
        </form>
      )}

      <div className="mt-3 space-y-2">
        {challenges.length === 0 && <p className="py-6 text-center text-sm text-slate-text">No challenges yet.</p>}
        {challenges.map((c) => (
          <div key={c._id} className="rounded-lg border border-ink/10 bg-white p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-ink">{c.title}</p>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${c.status === "completed" ? "bg-sage/10 text-sage" : "bg-brass/10 text-brass-dark"}`}>{c.status}</span>
            </div>
            <p className="mt-1 text-xs text-slate-text">{c.points} points · {c.departments.map((d) => d.name).join(", ")}</p>
            {c.winner && <p className="mt-1 text-xs text-sage">Winner: {c.winner.name}</p>}
            {user?.role === "admin" && c.status !== "completed" && (
              <div className="mt-2 flex flex-wrap gap-2">
                {c.departments.map((d) => (
                  <button key={d._id} onClick={() => declareWinner(c._id, d._id)}
                    className="rounded-lg border border-ink/15 px-2.5 py-1 text-xs font-medium text-ink hover:bg-ink/5">
                    Declare {d.name} winner
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderboardTab;
