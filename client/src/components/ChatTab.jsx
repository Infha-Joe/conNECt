import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { io } from "socket.io-client";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { timeAgo } from "../utils/timeAgo";

const SOCKET_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace("/api", "");

const ChatTab = ({ workspaceId }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    api.get(`/workspaces/${workspaceId}/messages`).then(({ data }) => { setMessages(data.messages); setLoading(false); });

    const token = localStorage.getItem("connect_token");
    const socket = io(SOCKET_URL, { auth: { token } });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("workspace:join", workspaceId, (res) => { if (res?.success) setConnected(true); });
    });

    socket.on("workspace:message", (message) => { setMessages((prev) => [...prev, message]); });

    return () => { socket.emit("workspace:leave", workspaceId); socket.disconnect(); };
  }, [workspaceId]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!text.trim() || !socketRef.current) return;
    socketRef.current.emit("workspace:message", { workspaceId, text: text.trim() });
    setText("");
  };

  return (
    <div className="flex h-[28rem] flex-col rounded-xl border border-ink/10 bg-white">
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {loading && (<div className="flex justify-center py-10"><div className="h-6 w-6 animate-spin rounded-full border-2 border-ink/20 border-t-brass" /></div>)}
        {!loading && messages.length === 0 && <p className="py-10 text-center text-sm text-slate-text">No messages yet — say hello to your team.</p>}
        {messages.map((m) => {
          const isMine = m.sender._id === user._id;
          return (
            <div key={m._id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] ${isMine ? "items-end" : "items-start"} flex flex-col`}>
                {!isMine && <p className="mb-0.5 text-xs font-medium text-slate-text">{m.sender.name}</p>}
                <div className={`rounded-2xl px-3.5 py-2 text-sm ${isMine ? "bg-ink text-parchment" : "bg-ink/5 text-ink"}`}>{m.text}</div>
                <p className="mt-0.5 text-[10px] text-slate-text">{timeAgo(m.createdAt)}</p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={sendMessage} className="flex gap-2 border-t border-ink/5 p-3">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder={connected ? "Message your team…" : "Connecting…"} disabled={!connected}
          className="flex-1 rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-brass disabled:opacity-50" />
        <button type="submit" disabled={!connected || !text.trim()} className="flex items-center justify-center rounded-lg bg-ink px-3 py-2 text-parchment transition hover:bg-ink-light disabled:opacity-40"><Send size={16} /></button>
      </form>
    </div>
  );
};

export default ChatTab;
