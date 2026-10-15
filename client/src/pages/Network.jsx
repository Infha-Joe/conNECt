import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Search, UserPlus, Users, Clock } from "lucide-react";
import api from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";
import ConnectButton from "../components/ConnectButton";
import Avatar from "../components/ui/Avatar";
import { useAuth } from "../context/AuthContext";

const Network = () => {
  const [activeTab, setActiveTab] = useState("discover"); // discover | pending | connections
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  
  const [discoverResults, setDiscoverResults] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [myConnections, setMyConnections] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const { user: currentUser } = useAuth();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === "discover") {
        const { data } = await api.get("/users/search", { params: { query, role: roleFilter } });
        setDiscoverResults(data.users.filter((u) => u._id !== currentUser?._id));
      } else if (activeTab === "pending") {
        const { data } = await api.get("/connections/pending");
        setPendingRequests(data.requests);
      } else if (activeTab === "connections") {
        const { data } = await api.get(`/users/${currentUser._id}/connections`);
        setMyConnections(data.connections);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, query, roleFilter, currentUser]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle local rejection to remove from list without refetching immediately
  const handleRequestResponded = () => {
    // A slight delay to let ConnectButton finish its API call before refreshing the list
    setTimeout(loadData, 500);
  };

  const UserCard = ({ u, showConnect = true }) => {
    if (!u) return null;
    return (
      <div className="flex items-center justify-between rounded-xl border border-ink/10 bg-white p-4 shadow-sm hover:shadow-md transition">
        <Link to={`/profile/${u._id}`} className="flex items-center gap-4">
          <Avatar src={u.profilePhoto} name={u.name} className="h-12 w-12" />
          <div>
            <p className="text-base font-semibold text-ink">{u.name}</p>
            <div className="text-sm text-slate-500">
              {u.role === "student" && <p>Student &middot; {u.department?.name}</p>}
              {u.role === "teacher" && <p>Faculty &middot; {u.department?.name}</p>}
              {u.role === "alumni" && <p>Alumni &middot; {u.company || "Professional"}</p>}
            </div>
          </div>
        </Link>
        <div onClick={handleRequestResponded}>
          {showConnect && <ConnectButton userId={u._id} />}
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="w-full px-4 py-8">
        <h1 className="font-display text-3xl font-medium text-ink">My Network</h1>

        {/* Tabs */}
        <div className="mt-6 flex space-x-1 rounded-xl bg-ink/5 p-1">
          {[
            { id: "discover", label: "Discover", icon: Search },
            { id: "pending", label: "Pending Requests", icon: Clock },
            { id: "connections", label: "Connections", icon: Users },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition ${
                activeTab === tab.id
                  ? "bg-white text-ink shadow-sm"
                  : "text-slate-500 hover:bg-white/50 hover:text-ink"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
              {tab.id === "pending" && pendingRequests.length > 0 && (
                <span className="ml-1 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                  {pendingRequests.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Filters for Discover Tab */}
        {activeTab === "discover" && (
          <div className="mt-6 flex gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or skills"
                className="w-full rounded-lg border border-ink/15 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-brass focus:ring-1 focus:ring-brass"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-lg border border-ink/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-brass focus:ring-1 focus:ring-brass"
            >
              <option value="">All roles</option>
              <option value="student">Students</option>
              <option value="teacher">Faculty</option>
              <option value="alumni">Alumni</option>
            </select>
          </div>
        )}

        {/* Results Content */}
        <div className="mt-6 space-y-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink/20 border-t-brass" />
            </div>
          ) : (
            <>
              {activeTab === "discover" && (
                <>
                  {(!discoverResults || discoverResults.length === 0) && <p className="py-10 text-center text-slate-500">No users found.</p>}
                  {(discoverResults || []).map((u) => <UserCard key={u._id} u={u} />)}
                </>
              )}
              {activeTab === "pending" && (
                <>
                  {(!pendingRequests || pendingRequests.length === 0) && <p className="py-10 text-center text-slate-500">No pending requests.</p>}
                  {(pendingRequests || []).map((req) => <UserCard key={req._id} u={req.requester} />)}
                </>
              )}
              {activeTab === "connections" && (
                <>
                  {(!myConnections || myConnections.length === 0) && <p className="py-10 text-center text-slate-500">You haven't connected with anyone yet.</p>}
                  {(myConnections || []).map((u) => <UserCard key={u._id} u={u} />)}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Network;
