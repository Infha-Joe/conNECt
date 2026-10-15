import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Send, ArrowLeft, MessageSquare, Paperclip, Loader2, X } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useBadges } from "../context/BadgeContext";
import { useSocket } from "../hooks/useSocket";
import DashboardLayout from "../layouts/DashboardLayout";
import { timeAgo } from "../utils/timeAgo";

const Messages = () => {
  const { user: currentUser } = useAuth();
  const { decrementMessages, fetchCounts } = useBadges();
  const location = useLocation();
  const serverUrl = useMemo(() => api.defaults.baseURL.replace('/api', ''), []);

  const [conversations, setConversations] = useState([]);
  const [activePartner, setActivePartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [pendingAttachment, setPendingAttachment] = useState(null);
  const [attachmentPreview, setAttachmentPreview] = useState(null);
  const [attachmentType, setAttachmentType] = useState(null); // 'image', 'video', 'file'

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Load conversation list
  const loadConversations = useCallback(async () => {
    try {
      const { data } = await api.get("/messages/conversations");
      setConversations(data.conversations);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingConvos(false);
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Handle direct navigation to a chat (e.g., from Profile 'Message' button)
  useEffect(() => {
    if (location.state?.activeUserId && conversations.length > 0) {
      const partner = conversations.find(c => c.partner._id === location.state.activeUserId)?.partner;
      if (partner) openChat(partner);
    }
  }, [location.state, conversations]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const openChat = async (partner) => {
    setActivePartner(partner);
    setLoadingMessages(true);
    try {
      const { data } = await api.get(`/messages/${partner._id}`);
      setMessages(data.messages);

      // If there were unread messages in this conversation, mark them read
      const convo = conversations.find(c => c.partner._id === partner._id);
      if (convo && convo.unreadCount > 0) {
        await api.put(`/messages/${partner._id}/read`);
        decrementMessages(convo.unreadCount);
        setConversations(prev => prev.map(c => c.partner._id === partner._id ? { ...c, unreadCount: 0 } : c));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const removeAttachment = () => {
    if (attachmentPreview && (attachmentType === "image" || attachmentType === "video")) {
      URL.revokeObjectURL(attachmentPreview);
    }
    setPendingAttachment(null);
    setAttachmentPreview(null);
    setAttachmentType(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const sendMessage = async (e) => {
    if (e) e.preventDefault();
    
    if (!activePartner) return;
    if (!inputText.trim() && !pendingAttachment) return;

    setUploading(true);
    let mediaUrl = null;
    let mediaType = null;

    try {
      if (pendingAttachment) {
        const formData = new FormData();
        formData.append("media", pendingAttachment);

        const { data } = await api.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        mediaUrl = data.url;
        mediaType = attachmentType;
      }

      const textToSend = inputText.trim();
      const tempId = Date.now().toString();
      const newMsg = {
        _id: tempId,
        sender: currentUser?._id,
        recipient: activePartner._id,
        text: textToSend,
        mediaUrl,
        mediaType,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, newMsg]);
      setInputText("");
      removeAttachment();
      
      // Update conversation preview optimistically
      setConversations(prev => {
        const existing = prev.find(c => c.partner._id === activePartner._id);
        const updatedConvo = {
          partner: activePartner,
          lastMessage: { 
            text: newMsg.text || "Sent an attachment", 
            createdAt: newMsg.createdAt, 
            isMine: true 
          },
          unreadCount: 0
        };
        if (existing) {
          return [updatedConvo, ...prev.filter(c => c.partner._id !== activePartner._id)];
        }
        return [updatedConvo, ...prev];
      });

      await api.post(`/messages/${activePartner._id}`, { text: textToSend, mediaUrl, mediaType });
    } catch (err) {
      console.error("Failed to send", err);
      alert("Failed to send message.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file || !activePartner) return;

    if (file.size > 50000000) {
      alert("File size must be less than 50MB");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    let type = "file";
    const fileType = file.type.toLowerCase();
    if (fileType.startsWith("image/")) type = "image";
    else if (fileType.startsWith("video/")) type = "video";

    setPendingAttachment(file);
    setAttachmentType(type);

    if (type === "image" || type === "video") {
      setAttachmentPreview(URL.createObjectURL(file));
    } else {
      setAttachmentPreview(file.name);
    }
  };

  // Real-time incoming messages
  useSocket({
    "private_message:new": (message) => {
      // If we are currently chatting with this sender, append it and mark read
      if (activePartner && message.sender._id === activePartner._id) {
        setMessages((prev) => [...prev, message]);
        api.put(`/messages/${activePartner._id}/read`);
        fetchCounts(); // Re-sync global badge
      }
      
      // Update the conversation list on the left
      setConversations(prev => {
        const existing = prev.find(c => c.partner._id === (message.sender._id === currentUser?._id ? message.recipient._id : message.sender._id));
        const partnerInfo = message.sender._id === currentUser?._id ? message.recipient : message.sender;
        const isMine = message.sender._id === currentUser?._id;
        
        const updatedConvo = {
          partner: existing ? existing.partner : partnerInfo,
          lastMessage: { text: message.text, createdAt: message.createdAt, isMine },
          unreadCount: (activePartner?._id === message.sender._id) ? 0 : ((existing?.unreadCount || 0) + (isMine ? 0 : 1))
        };
        
        return [updatedConvo, ...prev.filter(c => c.partner._id !== partnerInfo._id)];
      });
    },
  });

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-80px)] overflow-hidden rounded-xl border border-ink/10 bg-white">
        
        {/* Left Pane - Conversations */}
        <div className={`w-full flex-col border-r border-ink/10 md:w-1/3 md:flex ${activePartner ? "hidden" : "flex"}`}>
          <div className="border-b border-ink/10 p-4">
            <h2 className="font-display text-xl font-medium text-ink">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loadingConvos ? (
              <div className="flex justify-center p-8"><div className="h-6 w-6 animate-spin rounded-full border-2 border-ink/20 border-t-brass" /></div>
            ) : (!conversations || conversations.length === 0) ? (
              <p className="p-8 text-center text-sm text-slate-500">No conversations yet. Head to your Network to start chatting!</p>
            ) : (
              (conversations || []).map((c) => (
                <button
                  key={c.partner._id}
                  onClick={() => openChat(c.partner)}
                  className={`flex w-full items-center gap-3 border-b border-ink/5 p-4 text-left transition hover:bg-ink/5 ${
                    activePartner?._id === c.partner._id ? "bg-ink/5" : ""
                  }`}
                >
                  <div className="relative">
                    {c.partner.profilePhoto ? (
                      <img src={c.partner.profilePhoto} alt="" className="h-12 w-12 rounded-full object-cover" />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 font-display font-medium text-ink">
                        {(c.partner?.name?.[0] || "?")}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between">
                      <p className="truncate font-semibold text-ink">{c.partner.name}</p>
                      {c.lastMessage && (
                        <span className="text-xs text-slate-400">{timeAgo(c.lastMessage.createdAt)}</span>
                      )}
                    </div>
                    {c.lastMessage ? (
                      <p className={`truncate text-sm ${c.unreadCount > 0 ? "font-semibold text-ink" : "text-slate-500"}`}>
                        {c.lastMessage.isMine ? "You: " : ""}{c.lastMessage.text}
                      </p>
                    ) : (
                      <p className="truncate text-sm text-primary font-medium">New connection</p>
                    )}
                  </div>
                  {c.unreadCount > 0 && (
                    <div className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
                      {c.unreadCount}
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Pane - Active Chat */}
        <div className={`flex-1 flex-col bg-slate-50 md:flex ${activePartner ? "flex" : "hidden"}`}>
          {activePartner ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center gap-3 border-b border-ink/10 bg-white p-4">
                <button className="md:hidden" onClick={() => setActivePartner(null)}>
                  <ArrowLeft size={20} className="text-ink" />
                </button>
                {activePartner.profilePhoto ? (
                  <img src={activePartner.profilePhoto} alt="" className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 font-display font-medium text-ink">
                    {(activePartner?.name?.[0] || "?")}
                  </div>
                )}
                <div>
                  <Link to={`/profile/${activePartner._id}`} className="font-semibold text-ink hover:underline">
                    {activePartner.name}
                  </Link>
                  <p className="text-xs text-slate-500 capitalize">{activePartner.role}</p>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loadingMessages ? (
                  <div className="flex justify-center p-8"><div className="h-6 w-6 animate-spin rounded-full border-2 border-ink/20 border-t-brass" /></div>
                ) : (!messages || messages.length === 0) ? (
                  <p className="text-center text-sm text-slate-500 mt-10">Start the conversation with {activePartner.name}</p>
                ) : (
                  (messages || []).map((msg, i) => {
                    const isMine = msg.sender === currentUser?._id || msg.sender?._id === currentUser?._id;
                    return (
                      <div key={msg._id || i} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${
                            isMine ? "bg-primary text-white rounded-br-sm" : "bg-white text-ink border border-ink/10 rounded-bl-sm shadow-sm"
                          }`}
                        >
                              {msg.mediaUrl && (
                                <div className="mt-1 mb-2 max-w-full overflow-hidden rounded-lg">
                                  {msg.mediaType === "image" ? (
                                    <img src={`${serverUrl}${msg.mediaUrl}`} alt="attachment" className="max-h-64 w-auto object-cover" />
                                  ) : msg.mediaType === "video" ? (
                                    <video src={`${serverUrl}${msg.mediaUrl}`} controls className="max-h-64 w-auto" />
                                  ) : (
                                    <a 
                                      href={`${serverUrl}${msg.mediaUrl}`} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className={`flex items-center gap-2 underline break-all ${isMine ? "text-white" : "text-primary"}`}
                                    >
                                      <Paperclip size={16} className="shrink-0" />
                                      {msg.mediaUrl.split('-').pop()}
                                    </a>
                                  )}
                                </div>
                              )}
                              {msg.text && <span className="break-words">{msg.text}</span>}
                            {msg.sharedPost && (
                              <div className={`mt-1 p-3 rounded-lg border ${isMine ? 'bg-white/10 border-white/20' : 'bg-slate-50 border-slate-200'}`}>
                                <p className="font-semibold text-[13px] mb-1">{msg.sharedPost.author?.name || "Shared Post"}</p>
                                <Link to={`/post/${msg.sharedPost._id || msg.sharedPost}`} className={`text-[12px] font-bold underline ${isMine ? 'text-white' : 'text-primary'}`}>
                                  View Post &rarr;
                                </Link>
                              </div>
                            )}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Preview Area */}
              {pendingAttachment && (
                <div className="border-t border-ink/10 bg-slate-50 p-3 flex flex-col items-start gap-2">
                  <div className="relative inline-block max-w-[200px] rounded-xl border border-ink/10 bg-white p-2 shadow-sm">
                    <button
                      type="button"
                      onClick={removeAttachment}
                      disabled={uploading}
                      className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-700 text-white shadow-md hover:bg-slate-800 disabled:opacity-50"
                    >
                      <X size={14} />
                    </button>
                    {attachmentType === "image" ? (
                      <img src={attachmentPreview} alt="preview" className="max-h-24 w-auto rounded-lg object-contain" />
                    ) : attachmentType === "video" ? (
                      <video src={attachmentPreview} className="max-h-24 w-auto rounded-lg" />
                    ) : (
                      <div className="flex items-center gap-2 p-1 overflow-hidden">
                        <Paperclip size={16} className="text-slate-500 shrink-0" />
                        <span className="truncate text-[13px] text-slate-700 font-medium">{attachmentPreview}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <form onSubmit={sendMessage} className="border-t border-ink/10 bg-white p-4">
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.zip,.txt,.csv"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 disabled:opacity-50 shrink-0"
                  >
                    {uploading ? <Loader2 size={18} className="animate-spin" /> : <Paperclip size={18} />}
                  </button>

                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 rounded-full border border-ink/20 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand min-w-0"
                  />
                  <button
                    type="submit"
                    disabled={(!inputText.trim() && !pendingAttachment) || uploading}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white transition hover:bg-primary-dark disabled:opacity-50"
                  >
                    <Send size={16} className="-ml-0.5" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-slate-400">
              <MessageSquare size={48} className="mb-4 opacity-20" />
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Messages;
