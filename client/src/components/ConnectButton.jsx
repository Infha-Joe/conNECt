import { useState, useEffect } from "react";
import { UserPlus, Clock, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import api from "../services/api";

const ConnectButton = ({ userId }) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading | none | pending-outgoing | pending-incoming | accepted
  const [connectionId, setConnectionId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    api.get(`/users/${userId}/connection-status`).then(({ data }) => {
      if (data.status === "none") setStatus("none");
      else if (data.status === "accepted") setStatus("accepted");
      else if (data.status === "pending" && data.direction === "outgoing") setStatus("pending-outgoing");
      else if (data.status === "pending" && data.direction === "incoming") setStatus("pending-incoming");
      else setStatus("none");
      setConnectionId(data.connectionId || null);
    });
  };

  useEffect(() => { load(); }, [userId]);

  const sendRequest = async () => {
    setSubmitting(true);
    setStatus("pending-outgoing"); // optimistic
    try {
      const res = await api.post(`/users/${userId}/connect`);
      if (res.data && res.data.status) {
        setStatus(res.data.status); // update with actual backend status
      }
    } catch (err) {
      // If the backend says we're already connected, fetch the real status
      load();
    } finally {
      setSubmitting(false);
    }
  };

  const respond = async (action) => {
    setSubmitting(true);
    try {
      await api.put(`/connections/${connectionId}/respond`, { action });
      load();
    } finally {
      setSubmitting(false);
    }
  };

  const disconnect = async () => {
    setSubmitting(true);
    try {
      await api.delete(`/users/${userId}/connect`);
      setStatus("none");
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading") return null;

    if (status === "accepted") {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/messages', { state: { activeUserId: userId } })}
          disabled={submitting}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:opacity-50"
        >
          <MessageSquare size={15} className="-ml-0.5" />
          Message
        </button>
        <button
          onClick={disconnect}
          disabled={submitting}
          className="flex items-center gap-1.5 rounded-lg border border-ink/15 px-4 py-1.5 text-sm font-semibold text-ink transition hover:bg-ink/5 disabled:opacity-50"
        >
          <UserCheck size={15} />
          Connected
        </button>
      </div>
    );
  }

  if (status === "pending-outgoing") {
    return (
      <button
        disabled
        className="flex items-center gap-1.5 rounded-lg bg-ink/5 px-4 py-1.5 text-sm font-semibold text-slate-text"
      >
        <Clock size={15} className="animate-pulse" />
        Pending
      </button>
    );
  }

  if (status === "pending-incoming") {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => respond("accept")}
          disabled={submitting}
          className="rounded-lg bg-ink px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-ink-light disabled:opacity-50"
        >
          Accept
        </button>
        <button
          onClick={() => respond("reject")}
          disabled={submitting}
          className="rounded-lg border border-ink/15 px-3 py-1.5 text-sm font-medium text-ink transition hover:bg-ink/5 disabled:opacity-50"
        >
          Decline
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={sendRequest}
      disabled={submitting}
      className="flex items-center gap-1.5 rounded-lg bg-ink px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-ink-light disabled:opacity-50"
    >
      <UserPlus size={15} />
      Connect
    </button>
  );
};

export default ConnectButton;
