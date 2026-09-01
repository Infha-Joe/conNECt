import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, Plus } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../layouts/DashboardLayout";

const Clubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { user } = useAuth();

  const loadClubs = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/clubs");
      setClubs(data.clubs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadClubs(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.post("/clubs", { name, description, coordinator: user._id });
    setName(""); setDescription(""); setShowCreate(false);
    loadClubs();
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-medium text-ink">Clubs</h1>
          {user?.role === "admin" && (
            <button onClick={() => setShowCreate((s) => !s)}
              className="flex items-center gap-1.5 rounded-lg bg-ink px-3 py-1.5 text-sm font-semibold text-parchment transition hover:bg-ink-light">
              <Plus size={16} /> New club
            </button>
          )}
        </div>

        {showCreate && (
          <form onSubmit={handleCreate} className="mt-4 space-y-3 rounded-xl border border-ink/10 bg-white p-4">
            <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Club name"
              className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-brass" />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" rows={2}
              className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-brass" />
            <p className="text-xs text-slate-text">You'll be set as the coordinator — reassign later if needed.</p>
            <button type="submit" className="rounded-lg bg-ink px-4 py-1.5 text-sm font-semibold text-parchment hover:bg-ink-light">Create</button>
          </form>
        )}

        <div className="mt-6 space-y-3">
          {loading && (<div className="flex justify-center py-10"><div className="h-6 w-6 animate-spin rounded-full border-2 border-ink/20 border-t-brass" /></div>)}
          {!loading && clubs.length === 0 && <p className="py-10 text-center text-sm text-slate-text">No clubs yet.</p>}
          {clubs.map((club) => (
            <Link key={club._id} to={`/clubs/${club._id}`} className="flex items-center justify-between rounded-xl border border-ink/10 bg-white p-4 transition hover:border-brass/40">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brass/10 text-brass-dark"><Users size={18} /></div>
                <div>
                  <p className="text-sm font-semibold text-ink">{club.name}</p>
                  <p className="text-xs text-slate-text">Coordinated by {club.coordinator?.name} · {club.memberCount} members</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Clubs;
