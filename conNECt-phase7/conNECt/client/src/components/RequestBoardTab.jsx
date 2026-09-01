import { useState, useEffect } from "react";
import { Plus, HandHelping, CheckCircle2 } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { timeAgo } from "../utils/timeAgo";

const categoryOptions = [
  { value: "item", label: "Item" },
  { value: "notes", label: "Notes" },
  { value: "teammate", label: "Teammate" },
  { value: "help", label: "Help" },
  { value: "other", label: "Other" },
];

const RequestBoardTab = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [filter, setFilter] = useState("open");
  const [form, setForm] = useState({ title: "", description: "", category: "other" });
  const { user } = useAuth();

  const load = async (status) => {
    setLoading(true);
    const { data } = await api.get("/community-requests", { params: status ? { status } : {} });
    setRequests(data.requests);
    setLoading(false);
  };

  useEffect(() => { load(filter); }, [filter]);

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.post("/community-requests", form);
    setForm({ title: "", description: "", category: "other" });
    setShowCreate(false);
    load(filter);
  };

  const helpWith = async (id) => {
    await api.put(`/community-requests/${id}/resolve`);
    load(filter);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowCreate((s) => !s)}
          className="flex items-center gap-1.5 rounded-lg bg-ink px-3 py-1.5 text-sm font-semibold text-parchment transition hover:bg-ink-light"
        >
          <Plus size={16} />
          Post a request
        </button>

        <div className="flex gap-1 rounded-lg border border-ink/10 bg-white p-1">
          {["open", "resolved"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-md px-3 py-1 text-xs font-medium capitalize transition ${
                filter === s ? "bg-ink text-parchment" : "text-slate-text hover:bg-ink/5"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="mt-3 space-y-3 rounded-xl border border-ink/10 bg-white p-4">
          <input
            required
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            placeholder="e.g. 'Need a calculator for tomorrow's exam'"
            className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-brass"
          />
          <textarea
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            placeholder="Any extra details (optional)"
            rows={2}
            className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-brass"
          />
          <select
            value={form.category}
            onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
            className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-brass"
          >
            {categoryOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <button type="submit" className="rounded-lg bg-ink px-4 py-1.5 text-sm font-semibold text-parchment hover:bg-ink-light">
            Post request
          </button>
        </form>
      )}

      <div className="mt-6 space-y-3">
        {loading && (
          <div className="flex justify-center py-10">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-ink/20 border-t-brass" />
          </div>
        )}

        {!loading && requests.length === 0 && (
          <p className="py-10 text-center text-sm text-slate-text">
            {filter === "open" ? "No open requests right now." : "No resolved requests yet."}
          </p>
        )}

        {requests.map((r) => (
          <div key={r._id} className="rounded-xl border border-ink/10 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-ink/5 px-2 py-0.5 text-xs font-medium capitalize text-ink">{r.category}</span>
                </div>
                <p className="mt-1.5 text-sm font-semibold text-ink">{r.title}</p>
                {r.description && <p className="mt-1 text-sm text-ink">{r.description}</p>}
                <p className="mt-1 text-xs text-slate-text">
                  {r.user?.name} · {timeAgo(r.createdAt)}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                  r.status === "resolved" ? "bg-sage/10 text-sage" : "bg-brass/10 text-brass-dark"
                }`}
              >
                {r.status}
              </span>
            </div>

            {r.status === "open" && r.user?._id !== user?._id && (
              <button
                onClick={() => helpWith(r._id)}
                className="mt-3 flex items-center gap-1.5 rounded-lg bg-ink px-3 py-1.5 text-xs font-semibold text-parchment hover:bg-ink-light"
              >
                <HandHelping size={14} />
                I can help
              </button>
            )}

            {r.status === "resolved" && r.helper && (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-sage">
                <CheckCircle2 size={13} />
                Helped by {r.helper.name}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RequestBoardTab;
