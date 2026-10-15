import { useState } from "react";
import { Video, ExternalLink } from "lucide-react";
import api from "../services/api";

const VideoClassTab = ({ workspaceId }) => {
  const [roomUrl, setRoomUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const startClass = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post(`/workspaces/${workspaceId}/meeting`);
      setRoomUrl(data.roomUrl);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't start the video class. Make sure DAILY_API_KEY is set on the server.");
    } finally {
      setLoading(false);
    }
  };

  if (roomUrl) {
    return (
      <div className="overflow-hidden rounded-xl border border-ink/10 bg-white">
        <iframe title="conNECt video class" src={roomUrl} allow="camera; microphone; fullscreen; display-capture; autoplay" className="h-[32rem] w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-ink/15 bg-white px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brass/10 text-brass-dark"><Video size={24} /></div>
      <p className="mt-4 font-display text-lg text-ink">Start a video class</p>
      <p className="mt-1 max-w-sm text-sm text-slate-text">Only the mentor and project team can join — the room is private to this workspace.</p>
      {error && <p className="mt-3 max-w-sm text-sm text-red-600">{error}</p>}
      <button onClick={startClass} disabled={loading} className="mt-5 flex items-center gap-2 rounded-lg bg-ink px-5 py-2.5 text-sm font-semibold text-parchment transition hover:bg-ink-light disabled:opacity-50">
        <ExternalLink size={16} />{loading ? "Starting…" : "Start video class"}
      </button>
    </div>
  );
};

export default VideoClassTab;
