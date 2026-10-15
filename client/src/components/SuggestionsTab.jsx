import { useState, useEffect } from "react";
import { Plus, CheckCircle2 } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { timeAgo } from "../utils/timeAgo";

const targetOptions = [
  { value: "platform", label: "Platform" },
  { value: "facility", label: "Facility" },
  { value: "other", label: "Other" },
];

const SuggestionsTab = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ type: "suggestion", targetType: "platform", text: "" });
  const { user } = useAuth();

  const load = async () => {
    setLoading(true);
    const { data } = await api.get("/suggestions");
    setItems(data.suggestions);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.post("/suggestions", form);
    setForm({ type: "suggestion", targetType: "platform", text: "" });
    setShowCreate(false);
    load();
  };

  const markReviewed = async (id) => {
    await api.put(`/suggestions/${id}/review`);
    load();
  };

  return (
    <div>
      <button
        onClick={() => setShowCreate((s) => !s)}
        className="flex items-center gap-1.5 rounded-lg bg-ink px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-ink-light"
      >
        <Plus size={16} />
        Share suggestion or feedback
      </button>

      {showCreate && (
        <form onSubmit={handleCreate} className="mt-3 space-y-3 rounded-xl border border-ink/10 bg-white p-4">
          <div className="grid grid-cols-2 gap-2">
            {["suggestion", "feedback"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setForm((p) => ({ ...p, type: t }))}
                className={`rounded-lg border px-3 py-2 text-sm font-medium capitalize transition ${
                  form.type === t ? "border-brass bg-brass/10 text-ink" : "border-ink/15 text-slate-text hover:border-ink/30"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <select
            value={form.targetType}
            onChange={(e) => setForm((p) => ({ ...p, targetType: e.target.value }))}
            className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-brass"
          >
            {targetOptions.map((o) => (
              <option key={o.value} value={o.value}>
                About: {o.label}
              </option>
            ))}
          </select>

          <textarea
            required
            value={form.text}
            onChange={(e) => setForm((p) => ({ ...p, text: e.target.value }))}
            placeholder={form.type === "suggestion" ? "What could be improved?" : "Share your feedback…"}
            rows={3}
            className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-brass"
          />

          <button type="submit" className="rounded-lg bg-ink px-4 py-1.5 text-sm font-semibold text-white hover:bg-ink-light">
            Submit
          </button>
        </form>
      )}

      <div className="mt-6 space-y-3">
        {loading && (
          <div className="flex justify-center py-10">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-ink/20 border-t-brass" />
          </div>
        )}

        {!loading && items.length === 0 && (
          <p className="py-10 text-center text-sm text-slate-text">
            {user?.role === "admin" ? "No suggestions or feedback submitted yet." : "Nothing submitted yet — share your thoughts above."}
          </p>
        )}

        {items.map((item) => (
          <div key={item._id} className="rounded-xl border border-ink/10 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-ink/5 px-2 py-0.5 text-xs font-medium capitalize text-ink">{item.type}</span>
                  <span className="text-xs capitalize text-slate-text">{item.targetType}</span>
                </div>
                <p className="mt-2 text-sm text-ink">{item.text}</p>
                <p className="mt-1 text-xs text-slate-text">
                  {item.user?.name} · {timeAgo(item.createdAt)}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                  item.status === "reviewed" ? "bg-sage/10 text-sage" : "bg-brass/10 text-brass-dark"
                }`}
              >
                {item.status}
              </span>
            </div>

            {user?.role === "admin" && item.status === "pending" && (
              <button
                onClick={() => markReviewed(item._id)}
                className="mt-3 flex items-center gap-1.5 rounded-lg border border-ink/15 px-3 py-1 text-xs font-medium text-ink hover:bg-ink/5"
              >
                <CheckCircle2 size={13} />
                Mark reviewed
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestionsTab;
