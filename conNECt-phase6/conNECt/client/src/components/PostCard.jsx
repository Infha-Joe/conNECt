import { useState } from "react";
import { Heart, MessageCircle } from "lucide-react";
import api from "../services/api";
import { timeAgo } from "../utils/timeAgo";

const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(post.likedByMe || false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentCount, setCommentCount] = useState(post.commentCount || 0);

  const toggleLike = async () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    try {
      if (liked) await api.delete(`/posts/${post._id}/like`);
      else await api.post(`/posts/${post._id}/like`);
    } catch {
      setLiked((prev) => !prev);
      setLikeCount((prev) => (liked ? prev + 1 : prev - 1));
    }
  };

  const openComments = async () => {
    setShowComments((s) => !s);
    if (!showComments && comments.length === 0) {
      setLoadingComments(true);
      try {
        const { data } = await api.get(`/posts/${post._id}/comments`);
        setComments(data.comments);
      } finally {
        setLoadingComments(false);
      }
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const { data } = await api.post(`/posts/${post._id}/comments`, { text: commentText.trim() });
    setComments((prev) => [data.comment, ...prev]);
    setCommentCount((prev) => prev + 1);
    setCommentText("");
  };

  return (
    <article className="rounded-xl border border-ink/10 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink/5 font-display text-sm font-medium text-ink">
          {post.author?.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">{post.author?.name}</p>
          <p className="text-xs text-slate-text">
            <span className="capitalize">{post.author?.role}</span> · {timeAgo(post.createdAt)}
          </p>
        </div>
      </div>

      {post.caption && <p className="mt-3 whitespace-pre-wrap text-sm text-ink">{post.caption}</p>}
      {post.media?.length > 0 && (
        <div className="mt-3 overflow-hidden rounded-lg border border-ink/10">
          <img src={post.media[0]} alt="" className="max-h-96 w-full object-cover" />
        </div>
      )}

      <div className="mt-3 flex items-center gap-4 border-t border-ink/5 pt-3">
        <button onClick={toggleLike} className={`flex items-center gap-1.5 text-sm transition ${liked ? "text-red-500" : "text-slate-text hover:text-ink"}`}>
          <Heart size={17} fill={liked ? "currentColor" : "none"} />
          {likeCount}
        </button>
        <button onClick={openComments} className="flex items-center gap-1.5 text-sm text-slate-text transition hover:text-ink">
          <MessageCircle size={17} />
          {commentCount}
        </button>
      </div>

      {showComments && (
        <div className="mt-3 space-y-3 border-t border-ink/5 pt-3">
          <form onSubmit={submitComment} className="flex gap-2">
            <input value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Write a comment…"
              className="flex-1 rounded-lg border border-ink/15 px-3 py-1.5 text-sm outline-none focus:border-brass" />
            <button type="submit" disabled={!commentText.trim()}
              className="rounded-lg bg-ink/5 px-3 py-1.5 text-sm font-medium text-ink transition hover:bg-ink/10 disabled:opacity-40">
              Send
            </button>
          </form>
          {loadingComments && <p className="text-xs text-slate-text">Loading comments…</p>}
          {comments.map((c) => (
            <div key={c._id} className="flex gap-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink/5 text-xs font-medium text-ink">
                {c.user?.name?.[0]?.toUpperCase()}
              </div>
              <div className="rounded-lg bg-ink/5 px-3 py-1.5">
                <p className="text-xs font-semibold text-ink">{c.user?.name}</p>
                <p className="text-sm text-ink">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </article>
  );
};

export default PostCard;
