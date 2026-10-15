import { useState, useMemo, useEffect, useRef } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Card from "./ui/Card";
import Avatar from "./ui/Avatar";
import { FiThumbsUp, FiMessageSquare, FiShare2, FiMoreVertical, FiTrash2, FiSearch, FiX } from "react-icons/fi";

const PostCard = ({ post, onDelete }) => {
  const serverUrl = useMemo(() => api.defaults.baseURL.replace('/api', ''), []);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  // Menu and Delete
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const menuRef = useRef(null);

  // Share
  const [showShareModal, setShowShareModal] = useState(false);
  const [connections, setConnections] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSharing, setIsSharing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState("");

  const isLiked = likes.includes(user?._id);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/posts/${post._id}`);
      if (onDelete) onDelete(post._id);
    } catch (err) {
      console.error("Failed to delete post", err);
      alert(err.response?.data?.message || "Failed to delete post");
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const fetchConnections = async () => {
    try {
      if (!user?._id) return;
      const { data } = await api.get(`/users/${user._id}/connections`);
      setConnections(data.connections || []);
    } catch (err) {
      console.error("Failed to fetch connections", err);
    }
  };

  const handleShareClick = () => {
    setShowShareModal(true);
    fetchConnections();
    setShareSuccess("");
  };

  const handleShare = async (recipientId) => {
    setIsSharing(true);
    setShareSuccess("");
    try {
      await api.post(`/messages/${recipientId}`, {
        text: "Check out this post!",
        sharedPost: post._id
      });
      setShareSuccess("Shared successfully!");
      setTimeout(() => setShowShareModal(false), 2000);
    } catch (err) {
      console.error("Failed to share", err);
      alert(err.response?.data?.message || "Failed to share post");
    } finally {
      setIsSharing(false);
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
      const { data } = await api.post(`/posts/${post._id}/comments`, { content: newComment });
      setComments([data.comment, ...comments]);
      setNewComment("");
    } catch (err) {
      console.error("Failed to add comment", err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
  });

  const filteredConnections = connections.filter(friend => {
    return friend?.name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <Card className="mb-4 relative">
      {/* Post Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <Link to={`/profile/${post.author?._id}`}>
            <Avatar name={post.author?.name} size="md" />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-x-2">
              <Link to={`/profile/${post.author?._id}`} className="hover:underline hover:text-brand transition-colors">
                <h4 className="font-semibold text-ink text-[15px] truncate">{post.author?.name}</h4>
              </Link>
              <span className="hidden sm:inline text-slate-200">&bull;</span>
              <span className="text-[12px] text-slate-500/80">{formattedDate}</span>
            </div>
            <p className="text-[12px] text-slate-500 mt-0.5 truncate capitalize">
              {post.author?.role} &middot; {post.author?.department?.name || "College Member"}
            </p>
          </div>
        </div>

        {user?._id === post.author?._id && (
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setShowMenu(!showMenu)} 
              className="p-1.5 text-slate-400 hover:text-ink rounded-full hover:bg-slate-50 transition-colors"
            >
              <FiMoreVertical size={18} />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg border border-slate-100 py-1 z-10">
                <button 
                  onClick={() => { setShowMenu(false); setShowDeleteConfirm(true); }} 
                  className="w-full text-left px-4 py-2 text-[13px] text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <FiTrash2 size={14} /> Delete Post
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center rounded-2xl border border-red-100">
          <FiTrash2 size={24} className="text-red-500 mb-3" />
          <h3 className="text-[15px] font-bold text-ink mb-1">Delete this post?</h3>
          <p className="text-[13px] text-slate-500 mb-5">This action cannot be undone.</p>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isDeleting}
              className="px-4 py-1.5 text-[13px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-1.5 text-[13px] font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      )}

      {/* Post Content */}
      {post.content && (
        <div className="mb-4 text-ink text-[14px] leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>
      )}

      {/* Post Media */}
      {post.mediaUrl && (
        <div className="mb-4 rounded-xl overflow-hidden border border-border bg-black/5 flex items-center justify-center">
          {post.mediaType === "video" ? (
            <video src={`${serverUrl}${post.mediaUrl}`} controls className="w-full max-h-[500px] bg-black rounded-xl" />
          ) : (
            <img src={`${serverUrl}${post.mediaUrl}`} alt="Post attachment" className="w-full max-h-[500px] object-contain rounded-xl" />
          )}
        </div>
      )}

      {/* Post Stats */}
      {comments.length > 0 && (
        <div className="flex justify-end items-center text-[12px] text-slate-500 border-b border-slate-200 pb-3 mb-2">
          <span>{comments.length} comments</span>
        </div>
      )}
      {comments.length === 0 && <div className="border-b border-slate-200 pb-3 mb-2"></div>}

      {/* Post Actions */}
      <div className="flex gap-1">
        <button
          onClick={handleLike}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-[13px] font-medium transition-colors ${
            isLiked ? "text-brand hover:bg-primary/5" : "text-slate-500 hover:bg-slate-50 hover:text-ink"
          }`}
        >
          <FiThumbsUp size={16} className={isLiked ? "fill-brand" : ""} />
          <span>{isLiked ? "Liked" : "Like"}</span>
          {likes.length > 0 && (
            <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[11px] ${isLiked ? "bg-primary/10 text-brand" : "bg-slate-100 text-slate-500"}`}>
              {likes.length}
            </span>
          )}
        </button>
        <button
          onClick={toggleComments}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-[13px] font-medium text-slate-500 hover:bg-slate-50 hover:text-ink transition-colors"
        >
          <FiMessageSquare size={16} />
          <span>Comment</span>
        </button>
        <button
          onClick={handleShareClick}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-[13px] font-medium text-slate-500 hover:bg-slate-50 hover:text-ink transition-colors"
        >
          <FiShare2 size={16} />
          <span>Share</span>
        </button>
      </div>

      {/* Share Modal Overlay */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden flex flex-col">
            <div className="flex justify-between items-center px-4 py-3 border-b border-slate-100">
              <h3 className="font-bold text-ink">Share post</h3>
              <button onClick={() => setShowShareModal(false)} className="p-1 text-slate-400 hover:text-ink hover:bg-slate-100 rounded-full transition-colors">
                <FiX size={20} />
              </button>
            </div>
            
            <div className="p-3">
              <div className="relative mb-3">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search connections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[13px] outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              {shareSuccess && (
                <div className="mb-3 px-3 py-2 bg-green-50 text-green-700 text-[13px] font-medium rounded-lg text-center">
                  {shareSuccess}
                </div>
              )}

              <div className="max-h-64 overflow-y-auto space-y-1 pr-1">
                {filteredConnections.length === 0 ? (
                  <p className="text-center text-[13px] text-slate-500 py-4">No connections found.</p>
                ) : (
                  filteredConnections.map(friend => {
                    return (
                      <div key={friend._id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <Avatar name={friend.name} size="sm" />
                          <div className="min-w-0">
                            <p className="text-[13px] font-semibold text-ink truncate">{friend.name}</p>
                            <p className="text-[11px] text-slate-500 truncate capitalize">{friend.role}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleShare(friend._id)}
                          disabled={isSharing}
                          className="px-3 py-1.5 bg-primary text-white text-[12px] font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
                        >
                          Share
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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
                className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-[13px] text-ink outline-none focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
          </form>

          {isLoadingComments ? (
            <p className="text-[13px] text-center text-slate-500 py-2">Loading comments...</p>
          ) : comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment._id} className="flex gap-2.5">
                  <Link to={`/profile/${comment.author?._id}`}>
                    <Avatar name={comment.author?.name} size="sm" />
                  </Link>
                  <div className="flex-1">
                    <div className="rounded-2xl rounded-tl-sm bg-slate-50 px-3.5 py-2.5 inline-block">
                      <Link to={`/profile/${comment.author?._id}`} className="hover:underline">
                        <p className="text-[13px] font-semibold text-ink leading-tight">{comment.author?.name}</p>
                      </Link>
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
