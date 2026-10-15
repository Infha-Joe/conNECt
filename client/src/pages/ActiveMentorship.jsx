import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import useRecentAccess from "../hooks/useRecentAccess";
import { FiArrowLeft, FiSend, FiVideo, FiClock, FiPaperclip, FiX, FiFile, FiImage, FiSmile, FiDownload } from "react-icons/fi";
import { io } from "socket.io-client";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import RoadmapTracker from "../components/roadmap/RoadmapTracker";

const ActiveMentorship = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [mentorship, setMentorship] = useState(null);
  const [activeTab, setActiveTab] = useState("chat");
  const [loading, setLoading] = useState(true);

  useRecentAccess(
    mentorship ? "mentorship" : null,
    mentorship?._id,
    mentorship?.project?.title || "Mentorship",
    mentorship ? `/mentorship/${mentorship._id}` : null
  );

  // Chat state
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [attachment, setAttachment] = useState(null);
  const [attachmentPreview, setAttachmentPreview] = useState(null);
  const fileInputRef = useRef(null);

  // Classes state
  const [classes, setClasses] = useState([]);
  const [showClassForm, setShowClassForm] = useState(false);
  const [classForm, setClassForm] = useState({
    title: "", description: "", scheduledAt: "", durationMinutes: 60, meetingLink: ""
  });

  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetchMentorshipDetails();
    fetchClasses();
    fetchChatHistory();

    const token = localStorage.getItem("connect_token");
    const socket = io((import.meta.env.VITE_API_URL || "http://localhost:5005/api").replace("/api", ""), {
      auth: { token }
    });

    socket.on("connect", () => setIsSocketConnected(true));
    socket.on("disconnect", () => setIsSocketConnected(false));

    socket.emit("join_mentorship", { mentorshipId: id, token });

    socket.on("receive_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("message_updated", (updatedMessage) => {
      setMessages((prev) => prev.map(m => m._id === updatedMessage._id ? updatedMessage : m));
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMentorshipDetails = async () => {
    try {
      const res = await api.get(`/mentorship/${id}`);
      setMentorship(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchChatHistory = async () => {
    try {
      const res = await api.get(`/mentorship/${id}/chat`);
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await api.get(`/mentorship/${id}/classes`);
      setClasses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAttachmentChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 50000000) {
        alert('File size exceeds 50MB limit');
        return;
      }
      setAttachment(file);
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        const reader = new FileReader();
        reader.onload = (ev) => setAttachmentPreview(ev.target.result);
        reader.readAsDataURL(file);
      } else {
        setAttachmentPreview(null);
      }
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
    setAttachmentPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    const trimmed = newMessage.trim();
    if ((!trimmed && !attachment) || mentorship?.status === "expired" || mentorship?.status === "completed" || isSending) return;

    setIsSending(true);
    let uploadedAttachment = null;

    if (attachment) {
      const formData = new FormData();
      formData.append('media', attachment);
      try {
        const res = await api.post('/upload', formData);
        let type = 'file';
        if (attachment.type?.startsWith('image/')) type = 'image';
        else if (attachment.type?.startsWith('video/')) type = 'video';
        uploadedAttachment = { url: res.data.url, type, name: attachment.name };
      } catch (err) {
        alert('File upload failed.');
        setIsSending(false);
        return;
      }
    }

    const token = localStorage.getItem('connect_token');
    socketRef.current?.emit('send_message', {
      mentorshipId: id,
      content: trimmed,
      attachment: uploadedAttachment,
      token
    }, (response) => {
      setIsSending(false);
      if (response?.error) {
        alert(response.error);
      }
    });

    setNewMessage("");
    removeAttachment();
    setTimeout(() => {
      setIsSending(false);
    }, 800);
  };

  const handleToggleReaction = (messageId, emoji) => {
    const token = localStorage.getItem("connect_token");
    socketRef.current?.emit("toggle_reaction", {
      messageId,
      emoji,
      token,
      mentorshipId: id
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/mentorship/${id}/classes`, classForm);
      setShowClassForm(false);
      setClassForm({ title: "", description: "", scheduledAt: "", durationMinutes: 60, meetingLink: "" });
      fetchClasses();
    } catch (err) {
      alert(err.response?.data?.message || "Error creating class");
    }
  };

  const handleCloseMentorship = async () => {
    if (!window.confirm("Close Mentorship Workspace?\n\nThis will close this mentorship workspace for you and the mentee.\nChat and class history will no longer be active.")) return;
    
    try {
      await api.patch(`/mentorship/${id}/close`);
      fetchMentorshipDetails();
    } catch (err) {
      alert(err.response?.data?.message || "Error closing workspace");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm font-semibold text-slate-600">Loading workspace...</p>
        </div>
      </div>
    );
  }

  if (!mentorship) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 p-4">
        <div className="p-8 bg-white border border-slate-200 rounded-2xl shadow-sm text-center max-w-sm">
          <p className="font-bold text-ink text-lg mb-1">Workspace not found</p>
          <p className="text-xs text-slate-500 mb-5">This mentorship does not exist or you do not have permission to view it.</p>
          <Link to="/mentorship" className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-hover transition-colors shadow-sm">
            <FiArrowLeft size={14} /> Back to Mentorship
          </Link>
        </div>
      </div>
    );
  }

  const isMentor = user?._id === (mentorship.mentor?._id || mentorship.mentor);
  const otherParty = isMentor 
    ? (mentorship.requestType === "individual" ? mentorship.mentee?.name : mentorship.groupName)
    : (mentorship.mentor?.name || "Mentor");

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <Link to="/mentorship" className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-500 hover:text-ink">
            <FiArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-ink flex items-center gap-2">
              Mentorship Workspace 
              <span className={`text-xs px-2 py-1 rounded-full uppercase tracking-wider font-semibold ${
                mentorship.status === "active" ? "bg-green-100 text-green-800" : 
                mentorship.status === "completed" ? "bg-slate-50 text-slate-600" :
                "bg-red-100 text-red-800"
              }`}>
                {mentorship.status}
              </span>
            </h1>
            <p className="text-sm text-slate-500">With {otherParty} • {mentorship.status === 'completed' ? 'completed' : `Active until ${new Date(mentorship.endDate).toLocaleDateString()}`}</p>
          </div>
        </div>
          <div className="flex gap-2">
            <button onClick={() => setActiveTab("chat")} className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === "chat" ? "bg-slate-900 text-white" : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"}`}>Chat</button>
            <button onClick={() => setActiveTab("classes")} className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === "classes" ? "bg-slate-900 text-white" : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"}`}>Classes</button>
            <button onClick={() => setActiveTab("roadmap")} className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === "roadmap" ? "bg-slate-900 text-white" : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"}`}>Roadmap</button>
            {isMentor && (
              <button onClick={() => setActiveTab("settings")} className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === "settings" ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-200"}`}>Settings</button>
            )}
          </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative flex flex-col lg:flex-row">
        
        {/* Left Side: Chat/Classes/Settings */}
        <div className="flex-1 overflow-hidden relative flex flex-col">
          {activeTab === "chat" ? (
            <div className="h-full flex flex-col w-full bg-white relative">
              
              {/* Connection Status Indicator */}
              {!isSocketConnected && (
                <div className="absolute top-0 left-0 right-0 bg-yellow-50 border-b border-yellow-200 text-yellow-700 text-xs font-semibold py-1 text-center z-10">
                  Reconnecting...
                </div>
              )}

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                      <FiSend size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-ink mb-1">Start your mentorship conversation</h3>
                    <p className="text-sm">Send a message to your mentor and begin your discussion.</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => {
                    const isMe = (msg.sender?._id || msg.sender) === user?._id;
                    const serverBase = api.defaults.baseURL ? api.defaults.baseURL.replace("/api", "") : "http://localhost:5005";
                    const resolveUrl = (u) => {
                      if (!u) return "";
                      if (u.startsWith("http")) return u;
                      return `${serverBase}${u.startsWith("/") ? "" : "/"}${u}`;
                    };

                    return (
                      <div key={msg._id || idx} className={`group flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                        {!isMe && (
                          <div className="flex items-baseline gap-1 mb-1 ml-1">
                            <span className="text-xs font-semibold text-slate-600">{msg.sender?.name || "Participant"}</span>
                            <span className="text-[10px] text-slate-500 capitalize">
                              {msg.sender?._id === (mentorship.request?.requester?._id || mentorship.request?.requester) ? "Leader" : msg.sender?.role}
                            </span>
                          </div>
                        )}
                        <div className={`px-4 py-3 max-w-[80%] rounded-2xl whitespace-pre-wrap break-words shadow-sm ${
                          isMe ? "bg-teal-700 text-white rounded-br-none" : "bg-slate-100 text-ink rounded-bl-none"
                        }`}>
                          {msg.content && <p className="text-sm leading-relaxed">{msg.content}</p>}

                          {/* Render Attachment if present */}
                          {msg.attachment?.url && (() => {
                            const fileUrl = resolveUrl(msg.attachment.url);
                            const isImg = msg.attachment.type === "image" || fileUrl.match(/\.(jpeg|jpg|gif|png|webp|bmp)$/i);
                            const isVid = msg.attachment.type === "video" || fileUrl.match(/\.(mp4|webm|ogg)$/i);

                            if (isImg) {
                              return (
                                <div className={`${msg.content ? "mt-2.5" : ""} rounded-xl overflow-hidden border ${isMe ? "border-white/20" : "border-slate-200"}`}>
                                  <a href={fileUrl} target="_blank" rel="noreferrer">
                                    <img src={fileUrl} alt={msg.attachment.name || "Attachment"} className="max-h-64 w-auto rounded-lg object-contain hover:opacity-95 transition-opacity" />
                                  </a>
                                </div>
                              );
                            }

                            if (isVid) {
                              return (
                                <div className={`${msg.content ? "mt-2.5" : ""} rounded-xl overflow-hidden border ${isMe ? "border-white/20" : "border-slate-200"}`}>
                                  <video src={fileUrl} controls className="max-h-64 w-full rounded-lg" />
                                </div>
                              );
                            }

                            return (
                              <a
                                href={fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                download={msg.attachment.name || "attachment"}
                                className={`flex items-center gap-3 p-3 rounded-xl border transition-colors group/file ${msg.content ? "mt-2.5" : ""} ${
                                  isMe
                                    ? "bg-white/10 hover:bg-white/20 border-white/20 text-white"
                                    : "bg-white hover:bg-slate-50 border-slate-200 text-slate-800"
                                }`}
                              >
                                <div className={`p-2 rounded-lg shrink-0 ${isMe ? "bg-white/20 text-white" : "bg-teal-50 text-teal-600 border border-teal-100"}`}>
                                  <FiFile size={20} />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-bold truncate group-hover/file:underline">{msg.attachment.name || "Download Attachment"}</p>
                                  <p className={`text-[10px] ${isMe ? "text-white/70" : "text-slate-400"}`}>Click to open / download</p>
                                </div>
                                <FiDownload size={16} className={`shrink-0 ${isMe ? "text-white/80" : "text-slate-400"}`} />
                              </a>
                            );
                          })()}
                        </div>

                        {/* Reactions and Quick Emoji Picker */}
                        <div className="flex items-center gap-2 mt-1">
                          {msg.reactions && msg.reactions.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {msg.reactions.map((r, ri) => {
                                const hasReacted = r.users?.some(u => (u._id || u).toString() === user?._id?.toString());
                                return (
                                  <button
                                    key={ri}
                                    type="button"
                                    onClick={() => handleToggleReaction(msg._id, r.emoji)}
                                    className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-colors border ${
                                      hasReacted
                                        ? "bg-teal-50 border-teal-300 text-teal-700 font-bold"
                                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                    }`}
                                  >
                                    <span>{r.emoji}</span>
                                    <span className="text-[10px]">{r.users?.length || 0}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 bg-white border border-slate-200 rounded-full px-1.5 py-0.5 shadow-sm">
                            {["👍", "❤️", "😂", "😮", "😢", "👏"].map(emoji => (
                              <button
                                key={emoji}
                                type="button"
                                onClick={() => handleToggleReaction(msg._id, emoji)}
                                className="text-xs hover:scale-125 transition-transform p-0.5"
                                title={`React with ${emoji}`}
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>

                          <span className="text-[10px] text-slate-400">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="p-4 border-t border-slate-200 bg-slate-50">
                {attachment && (
                  <div className="mb-3 flex items-center gap-2.5 bg-white px-3.5 py-2 rounded-xl border border-teal-200 shadow-sm inline-flex relative pr-9 max-w-full">
                    {attachmentPreview ? (
                      <img src={attachmentPreview} alt="Preview" className="h-10 w-10 rounded-lg border border-slate-200 object-cover shrink-0" />
                    ) : attachment.type?.startsWith("video/") ? (
                      <div className="h-10 w-10 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 shrink-0">
                        <FiVideo size={20} />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 shrink-0">
                        <FiFile size={20} />
                      </div>
                    )}
                    <div className="min-w-0 max-w-[240px]">
                      <p className="text-xs font-bold text-slate-800 truncate">{attachment.name}</p>
                      <p className="text-[10px] text-slate-400">{(attachment.size / 1024).toFixed(1)} KB · Ready to send</p>
                    </div>
                    <button
                      type="button"
                      onClick={removeAttachment}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove attachment"
                    >
                      <FiX size={15} />
                    </button>
                  </div>
                )}
                <form onSubmit={handleSendMessage} className="flex gap-2 relative items-end max-w-[1100px]">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAttachmentChange}
                    className="hidden"
                    accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Attach file"
                    className="p-3 mb-1 text-slate-400 hover:text-brand transition-colors bg-white border border-slate-200 rounded-full"
                  >
                    <FiPaperclip size={18} />
                  </button>
                  <textarea
                    rows="1"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={mentorship.status === "expired" || mentorship.status === "completed" || isSending}
                    placeholder={(mentorship.status === "expired" || mentorship.status === "completed") ? "Mentorship is inactive" : "Type a message..."}
                    className="flex-1 border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-brand bg-white disabled:bg-slate-50 disabled:cursor-not-allowed resize-none max-h-32"
                    style={{ minHeight: "44px" }}
                  />
                  <button 
                    type="submit" 
                    disabled={(!newMessage.trim() && !attachment) || mentorship.status === "expired" || mentorship.status === "completed" || isSending}
                    className="p-3 mb-1 bg-teal-600 text-white rounded-full hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors shrink-0"
                  >
                    <FiSend size={18} />
                  </button>
                </form>
                <div className="text-[10px] text-slate-500 mt-2 text-center">
                  Press Enter to send, Shift + Enter for new line
                </div>
              </div>
            </div>
          ) : activeTab === "classes" ? (
            <div className="h-full overflow-y-auto p-6 lg:p-8">
              <div className="w-full">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-ink">Upcoming Classes</h2>
                  {isMentor && mentorship.status === "active" && (
                    <button onClick={() => setShowClassForm(!showClassForm)} className="px-4 py-2 bg-brand text-white font-medium text-sm rounded-lg hover:bg-blue-700 transition-colors">
                      {showClassForm ? "Cancel" : "Create Class"}
                    </button>
                  )}
                </div>

              {showClassForm && (
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8">
                  <h3 className="text-lg font-bold text-ink mb-4">Schedule a Class</h3>
                  <form onSubmit={handleCreateClass} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">Title</label>
                      <input required type="text" value={classForm.title} onChange={e => setClassForm({...classForm, title: e.target.value})} className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-brand" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">Description</label>
                      <input type="text" value={classForm.description} onChange={e => setClassForm({...classForm, description: e.target.value})} className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-brand" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Date & Time</label>
                        <input required type="datetime-local" value={classForm.scheduledAt} onChange={e => setClassForm({...classForm, scheduledAt: e.target.value})} className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-brand" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Duration (mins)</label>
                        <input required type="number" min="1" value={classForm.durationMinutes} onChange={e => setClassForm({...classForm, durationMinutes: e.target.value})} className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-brand" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">Meeting Link (Optional)</label>
                      <input type="text" pattern="https?://.+" title="Please enter a valid URL starting with http:// or https://" value={classForm.meetingLink} onChange={e => setClassForm({...classForm, meetingLink: e.target.value})} className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-brand" />
                    </div>
                    <div className="pt-2">
                      <button type="submit" className="w-full py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors">Schedule Class</button>
                    </div>
                  </form>
                </div>
              )}

              {classes.length === 0 ? (
                <div className="bg-white p-10 rounded-xl border border-slate-200 text-center text-slate-500">
                  <FiVideo size={48} className="mx-auto mb-4 text-slate-300" />
                  <p>No classes scheduled yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {classes.map(cls => (
                    <div key={cls._id} className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-sm transition-shadow">
                      <div>
                        <h3 className="font-bold text-ink text-lg">{cls.title}</h3>
                        {cls.description && <p className="text-sm text-slate-600 mt-1">{cls.description}</p>}
                        <div className="flex items-center gap-4 mt-3">
                          <span className="flex items-center gap-1 text-xs font-medium text-brand bg-blue-50 px-2 py-1 rounded-md">
                            <FiClock /> {new Date(cls.scheduledAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">{cls.durationMinutes} mins</span>
                        </div>
                      </div>
                      {cls.meetingLink && (
                        <a href={cls.meetingLink} target="_blank" rel="noopener noreferrer" className="shrink-0 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors text-center">
                          Join Meeting
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : activeTab === "roadmap" ? (
          <div className="h-full overflow-y-auto p-6 lg:p-8">
            <div className="w-full">
              <RoadmapTracker entityType="Mentorship" entityId={id} />
            </div>
          </div>
        ) : activeTab === "settings" && isMentor ? (
          <div className="h-full overflow-y-auto p-6 lg:p-8">
            <div className="w-full">
              <h2 className="text-2xl font-bold text-ink mb-8">Workspace Settings</h2>
              
              <div className="bg-white p-6 rounded-xl border border-red-200 shadow-sm">
                <h3 className="text-lg font-bold text-red-600 mb-2">Close Mentorship Workspace</h3>
                <p className="text-sm text-slate-600 mb-6">
                  Closing this workspace will permanently mark it as closed for both you and the student. Chat and classes will no longer be accessible for new interactions, but historical data will be preserved.
                </p>
                
                <button 
                  onClick={handleCloseMentorship}
                  disabled={mentorship.status === "completed"}
                  className="px-6 py-2 bg-red-50 text-red-600 font-bold border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {mentorship.status === "completed" ? "Workspace is Closed" : "Close Workspace"}
                </button>
              </div>
            </div>
          </div>
        ) : null}
        </div>

        {/* Right Side: Participants Sidebar */}
        <aside className="w-80 bg-white border-l border-slate-200 shadow-sm flex flex-col hidden lg:flex">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-bold text-ink">
              Participants {mentorship.requestType === "group" ? `(${mentorship.groupMembers?.length + 1})` : ""}
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Mentor */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 font-bold shrink-0">
                {mentorship.mentor.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-ink text-sm leading-tight">{mentorship.mentor.name}</p>
                <p className="text-xs text-brand font-medium">Teacher / Mentor</p>
              </div>
            </div>

            {/* Mentee (Individual) */}
            {mentorship.requestType === "individual" && mentorship.mentee && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 font-bold shrink-0">
                  {mentorship.mentee.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-ink text-sm leading-tight">{mentorship.mentee.name}</p>
                  <p className="text-xs text-slate-500 font-medium">Student</p>
                </div>
              </div>
            )}

            {/* Group Members */}
            {mentorship.requestType === "group" && mentorship.groupMembers?.map(member => {
              const leaderId = mentorship.request?.requester?._id || mentorship.request?.requester;
              const isLeader = member._id === leaderId;
              
              return (
                <div key={member._id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 font-bold shrink-0">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-ink text-sm leading-tight flex items-center gap-2">
                      {member.name}
                      {isLeader && <span className="text-[9px] bg-blue-50 text-brand px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">Leader</span>}
                    </p>
                    <p className="text-xs text-slate-500 font-medium">Student</p>
                  </div>
                </div>
              );
            })}

          </div>
        </aside>
      </main>
    </div>
  );
};

export default ActiveMentorship;
