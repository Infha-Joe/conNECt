import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, ClipboardList, MessageSquare, Video } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../layouts/DashboardLayout";
import AssignmentsTab from "../components/AssignmentsTab";
import ChatTab from "../components/ChatTab";
import VideoClassTab from "../components/VideoClassTab";

const tabs = [
  { id: "assignments", label: "Assignments", icon: ClipboardList },
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "video", label: "Video class", icon: Video },
];

const Workspace = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("assignments");

  useEffect(() => {
    api.get(`/workspaces/${id}`).then(({ data }) => setWorkspace(data.workspace)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return (<DashboardLayout><div className="flex justify-center py-16"><div className="h-6 w-6 animate-spin rounded-full border-2 border-ink/20 border-t-brass" /></div></DashboardLayout>);
  if (!workspace) return (<DashboardLayout><p className="text-sm text-slate-text">Workspace not found or access denied.</p></DashboardLayout>);

  const isMentor = workspace.mentor._id === user._id;

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-2xl">
        <div className="rounded-xl border border-ink/10 bg-white p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-brass-dark">Mentor Workspace</p>
          <h1 className="mt-1 font-display text-xl font-medium text-ink">{workspace.project.title}</h1>
          <p className="mt-1 text-sm text-slate-text">Mentor: <Link to={`/profile/${workspace.mentor._id}`} className="hover:underline">{workspace.mentor.name}</Link></p>
          <div className="mt-4 flex flex-wrap gap-4 border-t border-ink/5 pt-4 text-sm text-slate-text">
            <span className="flex items-center gap-1.5"><Calendar size={15} />{new Date(workspace.startDate).toLocaleDateString()} – {new Date(workspace.endDate).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="mt-6 flex gap-1 rounded-lg border border-ink/10 bg-white p-1">
          {tabs.map(({ id: tabId, label, icon: Icon }) => (
            <button key={tabId} onClick={() => setActiveTab(tabId)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium transition ${activeTab === tabId ? "bg-ink text-parchment" : "text-slate-text hover:bg-ink/5 hover:text-ink"}`}>
              <Icon size={15} />{label}
            </button>
          ))}
        </div>

        <div className="mt-4">
          {activeTab === "assignments" && <AssignmentsTab workspaceId={workspace._id} isMentor={isMentor} />}
          {activeTab === "chat" && <ChatTab workspaceId={workspace._id} />}
          {activeTab === "video" && <VideoClassTab workspaceId={workspace._id} />}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Workspace;
