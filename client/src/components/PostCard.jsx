import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Card from "./ui/Card";
import Avatar from "./ui/Avatar";
import { FiThumbsUp, FiMessageSquare, FiShare2 } from "react-icons/fi";

const PostCard = ({ post }) => {
  const { user } = useAuth();
  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  const isLiked = likes.includes(user?._id);

  const handleLike = async () => {
    try {
      const updatedLikes = isLiked
        ? likes.filter((id) => id !== user._id)
        : [...likes, user._id];
      setLikes(updatedLikes);

      const { data } = await api.post(`/posts/${post._id}/like`);
      setLikes(data.likes);
    } catch (err) {
      console.error("Failed to like post", err);
      setLikes(post.likes);
    }
  };

  const fetchComments = async () => {
    setIsLoadingComments(true);
    try {
      const { data } = await api.get(`/posts/${post._id}/comments`);
      setComments(data.comments);
    } catch (err) {
      console.error("Failed to fetch comments", err);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const toggleComments = () => {
    if (!showComments && comments.length === 0) {
      fetchComments();
    }
    setShowComments(!showComments);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmittingComment(true);
    try {
      const { data } = await api.post(`/posts/${post._id}/comments`, {
        content: newComment,
      });
      setComments([data.comment, ...comments]);
      setNewComment("");
    } catch (err) {
      console.error("Failed to add comment", err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <Card className="mb-4">
      {/* Post Header */}
      <div className="flex items-start gap-3 mb-4">
        <Avatar name={post.author?.name} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-x-2">
            <h4 className="font-semibold text-ink text-[15px] truncate">{post.author?.name}</h4>
            <span className="hidden sm:inline text-slate-200">&bull;</span>
            <span className="text-[12px] text-slate-500/80">{formattedDate}</span>
          </div>
          <p className="text-[12px] text-slate-500 mt-0.5 truncate capitalize">
            {post.author?.role} &middot; {post.author?.department?.name || "College Member"}
          </p>
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-4 text-ink text-[14px] leading-relaxed whitespace-pre-wrap">
        {post.content}
      </div>

      {/* Post Stats */}
      <div className="flex justify-between items-center text-[12px] text-slate-500 border-b border-slate-200 pb-3 mb-2">
        <div className="flex items-center gap-1.5">
          {likes.length > 0 && (
            <>
              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-brand text-white">
                <FiThumbsUp size={10} />
              </div>
              <span>{likes.length}</span>
            </>
          )}
        </div>
        <span>
          {comments.length > 0 ? comments.length : (post.commentCount || 0)}{" "}
          comments
        </span>
      </div>

      {/* Post Actions (Lightweight Row) */}
      <div className="flex gap-1">
        <button
          onClick={handleLike}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-[13px] font-medium transition-colors ${
            isLiked ? "text-brand hover:bg-brand/5" : "text-slate-500 hover:bg-slate-50 hover:text-ink"
          }`}
        >
          <FiThumbsUp size={16} className={isLiked ? "fill-brand" : ""} />
          <span>Like</span>
        </button>
        <button
          onClick={toggleComments}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-[13px] font-medium text-slate-500 hover:bg-slate-50 hover:text-ink transition-colors"
        >
          <FiMessageSquare size={16} />
          <span>Comment</span>
        </button>
        <button
          className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-[13px] font-medium text-slate-500 hover:bg-slate-50 hover:text-ink transition-colors"
        >
          <FiShare2 size={16} />
          <span>Share</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-3">
          <form onSubmit={handleCommentSubmit} className="flex gap-3 mb-6">
            <Avatar name={user?.name} size="sm" className="mt-1" />
            <div className="flex-1 flex flex-col gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a professional comment..."
                className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-[13px] text-ink outline-none focus:bg-white focus:border-brand focus:ring-1 focus:ring-brand transition-all"
              />
            </div>
          </form>

          {isLoadingComments ? (
            <p className="text-[13px] text-center text-slate-500 py-2">Loading comments...</p>
          ) : comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment._id} className="flex gap-2.5">
                  <Avatar name={comment.author?.name} size="sm" />
                  <div className="flex-1">
                    <div className="rounded-2xl rounded-tl-sm bg-slate-50 px-3.5 py-2.5 inline-block">
                      <p className="text-[13px] font-semibold text-ink leading-tight">{comment.author?.name}</p>
                      <p className="text-[10px] text-slate-500 mb-1 capitalize">
                        {comment.author?.role}
                      </p>
                      <p className="text-[13px] text-ink">{comment.content}</p>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 ml-2">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[13px] text-center text-slate-500 py-2">No comments yet.</p>
          )}
        </div>
      )}
    </Card>
  );
};

export default PostCard;
