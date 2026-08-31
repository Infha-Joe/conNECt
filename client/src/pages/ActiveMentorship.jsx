import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { FiArrowLeft, FiSend, FiVideo, FiClock } from "react-icons/fi";
import { io } from "socket.io-client";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const ActiveMentorship = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [mentorship, setMentorship] = useState(null);
  const [activeTab, setActiveTab] = useState("chat");
  const [loading, setLoading] = useState(true);

  // Chat state
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

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
    const socket = io(import.meta.env.VITE_API_URL || "http://localhost:5000", {
      auth: { token }
    });

    socket.on("connect", () => setIsSocketConnected(true));
    socket.on("disconnect", () => setIsSocketConnected(false));

    socket.emit("join_mentorship", { mentorshipId: id, token });

    socket.on("receive_message", (message) => {
      setMessages((prev) => [...prev, message]);
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

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() || mentorship?.status === "expired" || mentorship?.status === "completed" || isSending) return;

    setIsSending(true);
    const token = localStorage.getItem("connect_token");
    socketRef.current.emit("send_message", {
      mentorshipId: id,
      content: newMessage.trim(),
      token
    }, (response) => {
      // In case we want to support an ack from server
      setIsSending(false);
      if (response?.error) {
        alert("Unable to send message. Please try again.");
      } else {
        setNewMessage("");
      }
    });

    // Fallback if server doesn't support ack
    setTimeout(() => {
      setIsSending(false);
      setNewMessage("");
    }, 500);
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

  if (loading) return <div className="flex h-screen items-center justify-center bg-slate-50"><p>Loading workspace...</p></div>;
  if (!mentorship) return <div className="flex h-screen items-center justify-center bg-slate-50"><p>Mentorship not found or unauthorized.</p></div>;

  const isMentor = user._id === mentorship.mentor._id;
  const otherParty = isMentor 
    ? (mentorship.requestType === "individual" ? mentorship.mentee?.name : mentorship.groupName)
    : mentorship.mentor.name;

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <Link to="/mentorship" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-ink">
            <FiArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-ink flex items-center gap-2">
              Mentorship Workspace 
              <span className={`text-xs px-2 py-1 rounded-full uppercase tracking-wider font-semibold ${
                mentorship.status === "active" ? "bg-green-100 text-green-800" : 
                mentorship.status === "completed" ? "bg-slate-100 text-slate-600" :
                "bg-red-100 text-red-800"
              }`}>
                {mentorship.status}
              </span>
            </h1>
            <p className="text-sm text-slate-500">With {otherParty} • {mentorship.status === 'completed' ? 'completed' : `Active until ${new Date(mentorship.endDate).toLocaleDateString()}`}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setActiveTab("chat")} className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === "chat" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>Chat</button>
          <button onClick={() => setActiveTab("classes")} className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === "classes" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>Classes</button>
          {isMentor && (
            <button onClick={() => setActiveTab("settings")} className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === "settings" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>Settings</button>
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
                  <div className="h-full flex flex-col items-center justify-center text-slate-400">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
                      <FiSend size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-ink mb-1">Start your mentorship conversation</h3>
                    <p className="text-sm">Send a message to your mentor and begin your discussion.</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => {
                    const isMe = msg.sender._id === user._id;
                    return (
                      <div key={idx} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                        {!isMe && (
                          <div className="flex items-baseline gap-1 mb-1 ml-1">
                            <span className="text-xs font-semibold text-slate-600">{msg.sender.name}</span>
                            <span className="text-[10px] text-slate-400 capitalize">
                              {msg.sender._id === (mentorship.request?.requester?._id || mentorship.request?.requester) ? "Leader" : msg.sender.role}
                            </span>
                          </div>
                        )}
                        <div className={`px-4 py-3 max-w-[75%] rounded-2xl whitespace-pre-wrap break-words ${
                          isMe ? "bg-brand text-white rounded-br-none" : "bg-slate-100 text-ink rounded-bl-none"
                        }`}>
                          <p className="text-sm">{msg.content}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="p-4 border-t border-slate-200 bg-slate-50">
                <form onSubmit={handleSendMessage} className="flex gap-2 relative items-end max-w-4xl mx-auto">
                  <textarea
                    rows="1"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={mentorship.status === "expired" || mentorship.status === "completed" || isSending}
                    placeholder={(mentorship.status === "expired" || mentorship.status === "completed") ? "Mentorship is inactive" : "Type a message..."}
                    className="flex-1 border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-brand bg-white disabled:bg-slate-100 disabled:cursor-not-allowed resize-none max-h-32"
                    style={{ minHeight: "44px" }}
                  />
                  <button 
                    type="submit" 
                    disabled={!newMessage.trim() || mentorship.status === "expired" || mentorship.status === "completed" || isSending}
                    className="p-3 mb-1 bg-brand text-white rounded-full hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors shrink-0"
                  >
                    <FiSend size={18} />
                  </button>
                </form>
                <div className="text-[10px] text-slate-400 mt-2 text-center">
                  Press Enter to send, Shift + Enter for new line
                </div>
              </div>
            </div>
          ) : activeTab === "classes" ? (
            <div className="h-full overflow-y-auto p-6 lg:p-8">
              <div className="max-w-4xl mx-auto">
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
                      <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                      <input required type="text" value={classForm.title} onChange={e => setClassForm({...classForm, title: e.target.value})} className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-brand" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                      <input type="text" value={classForm.description} onChange={e => setClassForm({...classForm, description: e.target.value})} className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-brand" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Date & Time</label>
                        <input required type="datetime-local" value={classForm.scheduledAt} onChange={e => setClassForm({...classForm, scheduledAt: e.target.value})} className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-brand" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Duration (mins)</label>
                        <input required type="number" min="1" value={classForm.durationMinutes} onChange={e => setClassForm({...classForm, durationMinutes: e.target.value})} className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-brand" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Meeting Link (Optional)</label>
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
        ) : activeTab === "settings" && isMentor ? (
          <div className="h-full overflow-y-auto p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
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
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold shrink-0">
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
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold shrink-0">
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
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold shrink-0">
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
