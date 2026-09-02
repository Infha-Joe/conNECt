import { useState, useEffect } from "react";
import { Users, FileText, FolderGit2, PartyPopper, MessageSquarePlus, HandHelping } from "lucide-react";
import api from "../services/api";

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="rounded-xl border border-ink/10 bg-white p-4">
    <div className="flex items-center gap-2 text-slate-text">
      <Icon size={15} />
      <p className="text-xs font-medium uppercase tracking-wide">{label}</p>
    </div>
    <p className="mt-2 font-display text-2xl font-medium text-ink">{value}</p>
  </div>
);

const AdminOverviewTab = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/analytics").then(({ data }) => setAnalytics(data.analytics)).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-ink/20 border-t-brass" />
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={Users} label="Total Users" value={analytics.users.total} />
        <StatCard icon={FileText} label="Total Posts" value={analytics.content.posts} />
        <StatCard icon={FolderGit2} label="Total Projects" value={analytics.projects.total} />
        <StatCard icon={FolderGit2} label="Active Workspaces" value={analytics.projects.activeMentorCollaborations} />
        <StatCard icon={PartyPopper} label="Total Events" value={analytics.events.total} />
        <StatCard icon={Users} label="Event Registrations" value={analytics.events.totalRegistrations} />
        <StatCard icon={MessageSquarePlus} label="Pending Suggestions" value={analytics.community.pendingSuggestions} />
        <StatCard icon={HandHelping} label="Open Community Requests" value={analytics.community.openCommunityRequests} />
      </div>

      <div className="mt-6 rounded-xl border border-ink/10 bg-white p-4">
        <p className="mb-3 text-sm font-semibold text-ink">User breakdown</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {[
            ["Students", analytics.users.students],
            ["Teachers", analytics.users.teachers],
            ["Alumni", analytics.users.alumni],
            ["Admins", analytics.users.admins],
            ["Verified", analytics.users.verified],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg bg-ink/5 p-3 text-center">
              <p className="text-lg font-display font-medium text-ink">{value}</p>
              <p className="text-xs text-slate-text">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-ink/10 bg-white p-4">
        <p className="mb-3 text-sm font-semibold text-ink">Department activity</p>
        <div className="space-y-2">
          {analytics.departmentActivity.map((d) => (
            <div key={d.department._id} className="flex items-center justify-between rounded-lg border border-ink/5 p-2.5 text-sm">
              <span className="text-ink">{d.department.name}</span>
              <span className="text-slate-text">{d.userCount} users</span>
            </div>
          ))}
          {analytics.departmentActivity.length === 0 && (
            <p className="text-sm text-slate-text">No departments created yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOverviewTab;
