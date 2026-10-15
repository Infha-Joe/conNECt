import { useState } from "react";
import { ImagePlus, X } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const PostComposer = ({ onPostCreated }) => {
  const [caption, setCaption] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [showMediaInput, setShowMediaInput] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption.trim() && !mediaUrl.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await api.post("/posts", { caption: caption.trim(), media: mediaUrl.trim() ? [mediaUrl.trim()] : [] });
      onPostCreated(data.post);
      setCaption("");
      setMediaUrl("");
      setShowMediaInput(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-5 bg-transparent">
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-border/30 font-display text-sm font-medium text-ink">
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <textarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Share something with your network…" rows={2}
          className="flex-1 resize-none rounded-lg border-none bg-transparent text-sm text-ink outline-none placeholder:text-slate-text" />
      </div>

      {showMediaInput && (
        <div className="mt-3 flex items-center gap-2 pl-13">
          <input type="url" value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} placeholder="Paste an image URL"
            className="flex-1 rounded-lg border border-ink/15 px-3 py-1.5 text-sm outline-none focus:border-brass" />
          <button type="button" onClick={() => { setShowMediaInput(false); setMediaUrl(""); }} className="text-slate-text hover:text-ink">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between border-t border-ink/5 pt-3">
        <button type="button" onClick={() => setShowMediaInput((s) => !s)}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm text-slate-text transition hover:bg-border/30 hover:text-ink">
          <ImagePlus size={16} />
          Media
        </button>
        <button type="submit" disabled={submitting || (!caption.trim() && !mediaUrl.trim())}
          className="rounded-lg bg-ink px-4 py-1.5 text-sm font-semibold text-parchment transition hover:bg-ink-light disabled:opacity-40">
          {submitting ? "Posting…" : "Post"}
        </button>
      </div>
    </form>
  );
};

export default PostComposer;
