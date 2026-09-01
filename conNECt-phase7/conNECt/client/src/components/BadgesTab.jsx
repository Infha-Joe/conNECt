import { useState, useEffect } from "react";
import { Award, Lock } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const BadgesTab = () => {
  const { user } = useAuth();
  const [allBadges, setAllBadges] = useState([]);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/badges"), api.get(`/badges/user/${user._id}`)])
      .then(([allRes, earnedRes]) => {
        setAllBadges(allRes.data.badges);
        setEarnedBadges(earnedRes.data.badges);
      })
      .finally(() => setLoading(false));
  }, [user._id]);

  const earnedIds = new Set(earnedBadges.map((b) => b._id));

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-ink/20 border-t-brass" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-6 rounded-xl border border-ink/10 bg-white p-4">
        <div>
          <p className="text-2xl font-display font-medium text-ink">{user.xpPoints}</p>
          <p className="text-xs text-slate-text">XP Points</p>
        </div>
        <div className="h-8 w-px bg-ink/10" />
        <div>
          <p className="text-2xl font-display font-medium text-ink">{user.streak}</p>
          <p className="text-xs text-slate-text">Day streak</p>
        </div>
        <div className="h-8 w-px bg-ink/10" />
        <div>
          <p className="text-2xl font-display font-medium text-ink">{earnedBadges.length}</p>
          <p className="text-xs text-slate-text">Badges earned</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {allBadges.map((badge) => {
          const earned = earnedIds.has(badge._id);
          return (
            <div
              key={badge._id}
              className={`rounded-xl border p-4 text-center ${earned ? "border-brass/30 bg-brass/5" : "border-ink/10 bg-white opacity-60"}`}
            >
              <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${earned ? "bg-brass/15 text-brass-dark" : "bg-ink/5 text-slate-text"}`}>
                {earned ? <Award size={22} /> : <Lock size={18} />}
              </div>
              <p className="mt-2 text-xs font-semibold text-ink">{badge.name}</p>
              <p className="mt-0.5 text-[11px] text-slate-text">{badge.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BadgesTab;
