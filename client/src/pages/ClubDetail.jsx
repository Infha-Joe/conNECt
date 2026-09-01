import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Users } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../layouts/DashboardLayout";

const ClubDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [club, setClub] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await api.get(`/clubs/${id}`);
    setClub(data.club);
    setMembers(data.members);
    setIsMember(data.members.some((m) => m._id === user._id));
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  const toggleMembership = async () => {
    if (isMember) await api.delete(`/clubs/${id}/join`);
    else await api.post(`/clubs/${id}/join`);
    load();
  };

  if (loading) return (<DashboardLayout><div className="flex justify-center py-16"><div className="h-6 w-6 animate-spin rounded-full border-2 border-ink/20 border-t-brass" /></div></DashboardLayout>);

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-xl">
        <div className="rounded-xl border border-ink/10 bg-white p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brass/10 text-brass-dark"><Users size={22} /></div>
              <div>
                <h1 className="font-display text-xl font-medium text-ink">{club.name}</h1>
                <p className="text-sm text-slate-text">Coordinator: <Link to={`/profile/${club.coordinator._id}`} className="hover:underline">{club.coordinator.name}</Link></p>
              </div>
            </div>
            <button onClick={toggleMembership}
              className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition ${isMember ? "border border-ink/15 text-ink hover:bg-ink/5" : "bg-ink text-parchment hover:bg-ink-light"}`}>
              {isMember ? "Joined" : "Join club"}
            </button>
          </div>
          {club.description && <p className="mt-4 text-sm text-ink">{club.description}</p>}
        </div>

        <div className="mt-6">
          <p className="text-sm font-semibold text-ink">{members.length} Members</p>
          <div className="mt-3 space-y-2">
            {members.map((m) => (
              <Link key={m._id} to={`/profile/${m._id}`} className="flex items-center gap-3 rounded-lg border border-ink/10 bg-white p-3 transition hover:border-brass/40">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink/5 text-xs font-medium text-ink">{m.name?.[0]?.toUpperCase()}</div>
                <div><p className="text-sm font-medium text-ink">{m.name}</p><p className="text-xs capitalize text-slate-text">{m.role}</p></div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClubDetail;
