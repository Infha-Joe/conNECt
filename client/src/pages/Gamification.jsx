import { useState } from "react";
import { Award, ListChecks, Trophy } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import BadgesTab from "../components/BadgesTab";
import DailyTasksTab from "../components/DailyTasksTab";
import LeaderboardTab from "../components/LeaderboardTab";

const tabs = [
  { id: "badges", label: "Badges", icon: Award },
  { id: "tasks", label: "Daily Tasks", icon: ListChecks },
  { id: "leaderboard", label: "Leaderboard", icon: Trophy },
];

const Gamification = () => {
  const [activeTab, setActiveTab] = useState("badges");

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-2xl font-medium text-ink">Achievements</h1>
        <p className="mt-1 text-sm text-slate-text">Badges, streaks, daily goals, and department standings.</p>

        <div className="mt-6 flex gap-1 rounded-lg border border-ink/10 bg-white p-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-xs font-medium transition sm:text-sm ${
                activeTab === id ? "bg-ink text-parchment" : "text-slate-text hover:bg-ink/5 hover:text-ink"
              }`}
            >
              <Icon size={15} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        <div className="mt-5">
          {activeTab === "badges" && <BadgesTab />}
          {activeTab === "tasks" && <DailyTasksTab />}
          {activeTab === "leaderboard" && <LeaderboardTab />}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Gamification;
