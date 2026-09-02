import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Flame } from "lucide-react";
import api from "../services/api";

const DailyTasksTab = () => {
  const [tasks, setTasks] = useState([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await api.get("/daily-tasks");
    setTasks(data.tasks);
    setStreak(data.streak);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const complete = async (taskId) => {
    const { data } = await api.put(`/daily-tasks/${taskId}/complete`);
    setStreak(data.streak);
    setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, completed: true, xpEarned: 5 } : t)));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-ink/20 border-t-brass" />
      </div>
    );
  }

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between rounded-xl border border-ink/10 bg-white p-4">
        <div>
          <p className="text-sm font-semibold text-ink">Today's tasks</p>
          <p className="text-xs text-slate-text">{completedCount} of {tasks.length} completed</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-brass/10 px-3 py-1.5 text-sm font-semibold text-brass-dark">
          <Flame size={16} />
          {streak} day streak
        </div>
      </div>

      <div className="space-y-2">
        {tasks.map((task) => (
          <button
            key={task._id}
            onClick={() => !task.completed && complete(task._id)}
            disabled={task.completed}
            className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition ${
              task.completed ? "border-sage/30 bg-sage/5" : "border-ink/10 bg-white hover:border-brass/40"
            }`}
          >
            {task.completed ? (
              <CheckCircle2 size={20} className="shrink-0 text-sage" />
            ) : (
              <Circle size={20} className="shrink-0 text-slate-text" />
            )}
            <span className={`flex-1 text-sm ${task.completed ? "text-slate-text line-through" : "text-ink"}`}>
              {task.label}
            </span>
            <span className="text-xs font-medium text-brass-dark">+5 XP</span>
          </button>
        ))}
      </div>

      <p className="mt-4 text-center text-xs text-slate-text">
        Complete at least one task today to keep your streak alive.
      </p>
    </div>
  );
};

export default DailyTasksTab;
