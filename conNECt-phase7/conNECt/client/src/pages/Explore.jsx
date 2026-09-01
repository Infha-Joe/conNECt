import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import api from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";
import FollowButton from "../components/FollowButton";
import { useAuth } from "../context/AuthContext";

const Explore = () => {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user: currentUser } = useAuth();

  const search = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/users/search", { params: { query, role } });
      setResults(data.users.filter((u) => u._id !== currentUser?._id));
    } finally {
      setLoading(false);
    }
  }, [query, role, currentUser]);

  useEffect(() => { search(); }, [search]);

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-xl">
        <h1 className="font-display text-2xl font-medium text-ink">Discover people</h1>
        <div className="mt-4 flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-text" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, college ID, or skill"
              className="w-full rounded-lg border border-ink/15 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-brass" />
          </div>
          <select value={role} onChange={(e) => setRole(e.target.value)}
            className="rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-brass">
            <option value="">All roles</option>
            <option value="student">Students</option>
            <option value="teacher">Teachers</option>
            <option value="alumni">Alumni</option>
          </select>
        </div>

        <div className="mt-6 space-y-3">
          {loading && (
            <div className="flex justify-center py-10">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-ink/20 border-t-brass" />
            </div>
          )}
          {!loading && results.length === 0 && <p className="py-10 text-center text-sm text-slate-text">No users found.</p>}
          {results.map((u) => (
            <div key={u._id} className="flex items-center justify-between rounded-xl border border-ink/10 bg-white p-4">
              <Link to={`/profile/${u._id}`} className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-ink/5 font-display text-sm font-medium text-ink">
                  {u.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">{u.name}</p>
                  <p className="text-xs capitalize text-slate-text">{u.role} · {u.department?.name || "—"}</p>
                </div>
              </Link>
              <FollowButton userId={u._id} />
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Explore;
