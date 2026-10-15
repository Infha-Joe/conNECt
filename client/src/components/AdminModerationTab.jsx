import { useState, useEffect } from "react";
import { CheckCircle2, MessageSquarePlus } from "lucide-react";
import api from "../services/api";
import { timeAgo } from "../utils/timeAgo";

const AdminModerationTab = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");

  const load = async (status) => {
    setLoading(true);
    const { data } = await api.get("/suggestions", { params: status ? { status } : {} });
    setItems(data.suggestions);
    setLoading(false);
  };

  useEffect(() => { load(filter); }, [filter]);

  const markReviewed = async (id) => {
    await api.put(`/suggestions/${id}/review`);
    load(filter);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-sm font-semibold text-ink">
          <MessageSquarePlus size={15} />
          Suggestions & Feedback
        </p>
        <div className="flex gap-1 rounded-lg border border-ink/10 bg-white p-1">
          {["pending", "reviewed"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-md px-3 py-1 text-xs font-medium capitalize transition ${
                filter === s ? "bg-ink text-white" : "text-slate-text hover:bg-ink/5"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {loading && (
          <div className="flex justify-center py-10">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-ink/20 border-t-brass" />
          </div>
        )}

        {!loading && items.length === 0 && (
          <p className="py-10 text-center text-sm text-slate-text">
            {filter === "pending" ? "Nothing pending review." : "Nothing reviewed yet."}
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
                <p className="mt-1 text-xs text-slate-text">{item.user?.name} · {timeAgo(item.createdAt)}</p>
              </div>
            </div>

            {item.status === "pending" && (
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

export default AdminModerationTab;
