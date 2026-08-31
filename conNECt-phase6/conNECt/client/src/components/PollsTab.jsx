import { useState, useEffect } from "react";
import { Plus, X, Check } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { timeAgo } from "../utils/timeAgo";

const PollsTab = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const load = async () => {
    setLoading(true);
    const { data } = await api.get("/polls");
    setPolls(data.polls);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateOption = (i, value) => setOptions((prev) => prev.map((o, idx) => (idx === i ? value : o)));
  const addOption = () => setOptions((prev) => [...prev, ""]);
  const removeOption = (i) => setOptions((prev) => prev.filter((_, idx) => idx !== i));

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    const cleanOptions = options.map((o) => o.trim()).filter(Boolean);
    if (cleanOptions.length < 2) {
      setError("Add at least 2 options");
      return;
    }
    try {
      await api.post("/polls", { question, options: cleanOptions });
      setQuestion("");
      setOptions(["", ""]);
      setShowCreate(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't create poll");
    }
  };

  const vote = async (pollId, optionIndex) => {
    const { data } = await api.post(`/polls/${pollId}/vote`, { optionIndex });
    setPolls((prev) => prev.map((p) => (p._id === pollId ? { ...data.poll, hasVoted: true } : p)));
  };

  const totalVotes = (poll) => poll.options.reduce((sum, o) => sum + o.voteCount, 0);

  return (
    <div>
      <button
        onClick={() => setShowCreate((s) => !s)}
        className="flex items-center gap-1.5 rounded-lg bg-ink px-3 py-1.5 text-sm font-semibold text-parchment transition hover:bg-ink-light"
      >
        <Plus size={16} />
        New poll
      </button>

      {showCreate && (
        <form onSubmit={handleCreate} className="mt-3 space-y-3 rounded-xl border border-ink/10 bg-white p-4">
          <input
            required
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question — e.g. 'Which day works best for the workshop?'"
            className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-brass"
          />
          <div className="space-y-2">
            {options.map((opt, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={opt}
                  onChange={(e) => updateOption(i, e.target.value)}
                  placeholder={`Option ${i + 1}`}
                  className="flex-1 rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-brass"
                />
                {options.length > 2 && (
                  <button type="button" onClick={() => removeOption(i)} className="text-slate-text hover:text-ink">
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button type="button" onClick={addOption} className="text-sm font-medium text-brass-dark hover:underline">
            + Add option
          </button>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" className="rounded-lg bg-ink px-4 py-1.5 text-sm font-semibold text-parchment hover:bg-ink-light">
            Post poll
          </button>
        </form>
      )}

      <div className="mt-6 space-y-3">
        {loading && (
          <div className="flex justify-center py-10">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-ink/20 border-t-brass" />
          </div>
        )}

        {!loading && polls.length === 0 && (
          <p className="py-10 text-center text-sm text-slate-text">No polls yet — be the first to ask something.</p>
        )}

        {polls.map((poll) => {
          const total = totalVotes(poll);
          return (
            <div key={poll._id} className="rounded-xl border border-ink/10 bg-white p-4">
              <p className="text-sm font-semibold text-ink">{poll.question}</p>
              <p className="mt-0.5 text-xs text-slate-text">
                Asked by {poll.createdBy?.name} · {timeAgo(poll.createdAt)}
              </p>

              <div className="mt-3 space-y-2">
                {poll.options.map((opt, i) => {
                  const pct = total > 0 ? Math.round((opt.voteCount / total) * 100) : 0;
                  return (
                    <button
                      key={i}
                      onClick={() => !poll.hasVoted && vote(poll._id, i)}
                      disabled={poll.hasVoted}
                      className="relative w-full overflow-hidden rounded-lg border border-ink/10 px-3 py-2 text-left text-sm disabled:cursor-default"
                    >
                      {poll.hasVoted && (
                        <div
                          className="absolute inset-y-0 left-0 bg-brass/15"
                          style={{ width: `${pct}%` }}
                        />
                      )}
                      <div className="relative flex items-center justify-between">
                        <span className="text-ink">{opt.text}</span>
                        {poll.hasVoted && (
                          <span className="text-xs font-medium text-slate-text">
                            {pct}% ({opt.voteCount})
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {poll.hasVoted && (
                <p className="mt-2 flex items-center gap-1 text-xs text-sage">
                  <Check size={12} /> {total} vote{total !== 1 ? "s" : ""} total
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PollsTab;
