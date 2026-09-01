import { useState } from "react";
import { Vote, MessageSquarePlus, HandHelping } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import PollsTab from "../components/PollsTab";
import SuggestionsTab from "../components/SuggestionsTab";
import RequestBoardTab from "../components/RequestBoardTab";

const tabs = [
  { id: "polls", label: "Polls", icon: Vote },
  { id: "suggestions", label: "Suggestions & Feedback", icon: MessageSquarePlus },
  { id: "requests", label: "Campus Requests", icon: HandHelping },
];

const CommunityHub = () => {
  const [activeTab, setActiveTab] = useState("polls");

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-2xl font-medium text-ink">Community Hub</h1>
        <p className="mt-1 text-sm text-slate-text">Polls, feedback, and helping each other out around campus.</p>

        <div className="mt-6 flex gap-1 rounded-lg border border-ink/10 bg-white p-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-xs font-medium transition sm:text-sm ${
                activeTab === id ? "bg-ink text-parchment" : "text-slate-text hover:bg-ink/5 hover:text-ink"
              }`}>
              <Icon size={15} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        <div className="mt-5">
          {activeTab === "polls" && <PollsTab />}
          {activeTab === "suggestions" && <SuggestionsTab />}
          {activeTab === "requests" && <RequestBoardTab />}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CommunityHub;
