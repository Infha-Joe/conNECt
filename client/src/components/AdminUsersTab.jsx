import { useState, useEffect, useCallback } from "react";
import { Search, ShieldCheck, ShieldOff } from "lucide-react";
import api from "../services/api";

const roleOptions = ["", "student", "teacher", "alumni", "admin"];

const AdminUsersTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await api.get("/admin/users", { params: { search, role } });
    setUsers(data.users);
    setLoading(false);
  }, [search, role]);

  useEffect(() => { load(); }, [load]);

  const toggleVerify = async (user) => {
    const { data } = await api.put(`/admin/users/${user._id}/verify`, { isVerified: !user.isVerified });
    setUsers((prev) => prev.map((u) => (u._id === user._id ? data.user : u)));
  };

  const changeRole = async (userId, newRole) => {
    const { data } = await api.put(`/admin/users/${userId}/role`, { role: newRole });
    setUsers((prev) => prev.map((u) => (u._id === userId ? data.user : u)));
  };

  return (
    <div>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-text" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, or college ID"
            className="w-full rounded-lg border border-ink/15 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-brass"
          />
        </div>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-brass"
        >
          <option value="">All roles</option>
          {roleOptions.filter(Boolean).map((r) => (
            <option key={r} value={r} className="capitalize">{r}</option>
          ))}
        </select>
      </div>

      <div className="mt-4 space-y-2">
        {loading && (
          <div className="flex justify-center py-10">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-ink/20 border-t-brass" />
          </div>
        )}

        {!loading && users.length === 0 && <p className="py-10 text-center text-sm text-slate-text">No users found.</p>}

        {users.map((u) => (
          <div key={u._id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-ink/10 bg-white p-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink/5 text-sm font-medium text-ink">
                {u.name?.[0]?.toUpperCase()}
              </div>
              <div className="min-w-0">
<p className="text-sm font-semibold text-ink break-words">{u.name}</p>
                <p className="text-xs text-slate-text break-words truncate">{u.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={u.role}
                onChange={(e) => changeRole(u._id, e.target.value)}
                className="rounded-lg border border-ink/15 px-2 py-1 text-xs capitalize outline-none focus:border-brass"
              >
                {roleOptions.filter(Boolean).map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>

              <button
                onClick={() => toggleVerify(u)}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                  u.isVerified ? "bg-sage/10 text-sage" : "border border-ink/15 text-slate-text hover:bg-ink/5"
                }`}
              >
                {u.isVerified ? <ShieldCheck size={13} /> : <ShieldOff size={13} />}
                {u.isVerified ? "Verified" : "Unverified"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsersTab;
