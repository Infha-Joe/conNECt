import { useState, useEffect, useCallback, useRef } from "react";
import { Bell } from "lucide-react";
import api from "../services/api";
import { useSocket } from "../hooks/useSocket";
import { timeAgo } from "../utils/timeAgo";

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  const loadNotifications = useCallback(async () => {
    const { data } = await api.get("/notifications");
    setNotifications(data.notifications);
    setUnreadCount(data.unreadCount);
  }, []);

  useEffect(() => { loadNotifications(); }, [loadNotifications]);

  useSocket({
    "notification:new": (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    },
  });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (notification) => {
    if (notification.isRead) return;
    await api.put(`/notifications/${notification._id}/read`);
    setNotifications((prev) => prev.map((n) => (n._id === notification._id ? { ...n, isRead: true } : n)));
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setOpen((o) => !o)} className="relative rounded-lg p-2 text-slate-text transition hover:bg-ink/5 hover:text-ink">
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brass px-1 text-[10px] font-semibold text-ink">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 rounded-xl border border-ink/10 bg-white shadow-lg">
          <div className="border-b border-ink/5 px-4 py-3">
            <p className="text-sm font-semibold text-ink">Notifications</p>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-slate-text">
                Nothing yet — you'll see likes, comments, follows and event activity here.
              </p>
            ) : (
              notifications.map((n) => (
                <button key={n._id} onClick={() => markAsRead(n)}
                  className={`flex w-full flex-col items-start gap-0.5 border-b border-ink/5 px-4 py-3 text-left transition hover:bg-ink/5 ${!n.isRead ? "bg-brass/5" : ""}`}>
                  <p className="text-sm text-ink">{n.message}</p>
                  <p className="text-xs text-slate-text">{timeAgo(n.createdAt)}</p>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
