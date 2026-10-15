import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiBell, FiCheck, FiInfo, FiMessageSquare, FiUserPlus, FiAward, FiBriefcase, FiLifeBuoy } from "react-icons/fi";
import api from "../../services/api";
import { useBadges } from "../../context/BadgeContext";

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  
  const { unreadNotifications, decrementNotifications } = useBadges();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = async () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      setLoading(true);
      try {
        const res = await api.get("/notifications");
        setNotifications(res.data.notifications.slice(0, 5)); // Just show top 5 in dropdown
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const markAsRead = async (e, id) => {
    if (e) e.stopPropagation();
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
      decrementNotifications(1);
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const handleNotificationClick = (e, notif) => {
    if (!notif.isRead) markAsRead(e, notif._id);
    setIsOpen(false);
    
    if (notif.type === "post" || notif.type === "like" || notif.type === "comment") {
      if (notif.relatedId) navigate(`/post/${notif.relatedId}`);
    } else if (notif.type === "connection_request") {
      navigate("/notifications");
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "like": return <FiAward className="text-pink-500" />;
      case "comment": return <FiMessageSquare className="text-blue-500" />;
      case "follow": return <FiUserPlus className="text-emerald-500" />;
      case "mentor_request":
      case "mentor_response": return <FiBriefcase className="text-indigo-500" />;
      case "help_request": return <FiLifeBuoy className="text-amber-500" />;
      case "badge": return <FiAward className="text-yellow-500" />;
      default: return <FiInfo className="text-slate-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={`relative p-2.5 rounded-xl border transition-all ${
          isOpen ? "bg-background border-primary/20 text-primary" : "bg-surface border-border text-ink-light hover:text-primary hover:bg-background"
        }`}
      >
        <FiBell size={20} />
        {unreadNotifications > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white shadow-sm border-2 border-white">
            {unreadNotifications > 9 ? "9+" : unreadNotifications}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-[340px] md:w-[380px] origin-top-right rounded-2xl bg-surface shadow-card border border-border focus:outline-none overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background/50">
            <h3 className="text-sm font-bold text-ink">Notifications</h3>
          </div>

          <div className="max-h-[360px] overflow-y-auto overscroll-contain">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-ink/20 border-t-brass" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-8 text-center px-4">
                <p className="text-sm font-medium text-slate-600">No notifications</p>
                <p className="text-xs text-slate-400 mt-1">You're all caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {notifications.map((notif) => (
                  <div
                    key={notif._id}
                    className={`p-4 flex gap-3 transition-colors cursor-pointer ${notif.isRead ? "bg-surface" : "bg-primary/5"}`}
                    onClick={(e) => handleNotificationClick(e, notif)}
                  >
                    <div className="mt-0.5 shrink-0 bg-surface p-1.5 rounded-full border border-border shadow-sm self-start">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm truncate ${notif.isRead ? "font-medium text-slate-700" : "font-bold text-ink"}`}>
                        {notif.title}
                      </h4>
                      <p className={`text-xs mt-1 line-clamp-2 ${notif.isRead ? "text-slate-500" : "text-slate-600"}`}>
                        {notif.message}
                      </p>
                      <span className="text-[10px] font-medium text-slate-400 mt-1.5 block uppercase tracking-wider">
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {!notif.isRead && (
                      <div className="shrink-0 flex flex-col items-center justify-center pl-2">
                        <button
                          onClick={(e) => markAsRead(e, notif._id)}
                          className="w-7 h-7 rounded-full hover:bg-surface border border-transparent hover:border-border flex items-center justify-center text-primary transition-all"
                          title="Mark as read"
                        >
                          <FiCheck size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 bg-slate-50 p-2">
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className="block w-full rounded-xl py-2.5 text-center text-sm font-semibold text-primary transition hover:bg-slate-200/50"
            >
              View All Notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
