import React, { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";
import Button from "../components/ui/Button";
import { FiBell, FiCheck, FiInfo, FiMessageSquare, FiUserPlus, FiAward, FiBriefcase, FiLifeBuoy } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useBadges } from "../context/BadgeContext";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [connectionRequests, setConnectionRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { decrementNotifications, clearNotificationsCount } = useBadges();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [notifRes, connRes] = await Promise.all([
        api.get("/notifications"),
        api.get("/connections/pending")
      ]);
      setNotifications(notifRes.data.notifications);
      setConnectionRequests(connRes.data.requests);
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  const respondToConnection = async (id, action) => {
    try {
      await api.put(`/connections/${id}/respond`, { action });
      fetchData(); // reload both to clear the request and possibly the related notification
    } catch (err) {
      console.error("Failed to respond to connection", err);
    }
  };

  const markAsRead = async (e, id) => {
    if (e) e.stopPropagation();
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
      decrementNotifications(1);
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const handleNotificationClick = (e, notif) => {
    if (!notif.isRead) markAsRead(e, notif._id);
    
    if (notif.type === "post" || notif.type === "like" || notif.type === "comment") {
      if (notif.relatedId) navigate(`/post/${notif.relatedId}`);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put("/notifications/read-all");
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      clearNotificationsCount();
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  const getIcon = (type) => {
    switch(type) {
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
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-ink flex items-center gap-2">
          <FiBell className="text-brand" /> Notifications
        </h1>
        {notifications.some(n => !n.isRead) && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-500">Loading notifications...</div>
      ) : (
        <div className="space-y-6">
          {connectionRequests.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                <h3 className="font-semibold text-slate-600">Pending Connection Requests</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {connectionRequests.map((r) => (
                  <div key={r._id} className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <Link to={`/profile/${r.requester?._id || "unknown"}`} className="flex items-center gap-3 hover:opacity-80 transition">
                      {r.requester?.profilePhoto ? (
                        <img src={r.requester?.profilePhoto} alt={r.requester?.name || "Unknown User"} className="w-12 h-12 rounded-full object-cover border border-slate-200" />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink/5 font-display text-lg font-medium text-ink">
                          {r.requester?.name || "Unknown User"?.[0]?.toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-ink">{r.requester?.name || "Unknown User"}</p>
                        <p className="text-xs capitalize text-slate-500">{r.requester?.role || "user"} ?• {r.requester?.department?.name || ""}</p>
                      </div>
                    </Link>
                    <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                      <button
                        onClick={() => respondToConnection(r._id, "accept")}
                        className="flex-1 sm:flex-none rounded-lg bg-brand px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => respondToConnection(r._id, "reject")}
                        className="flex-1 sm:flex-none rounded-lg border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {notifications.length === 0 ? (
            <div className="bg-white p-10 rounded-xl border border-slate-200 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                <FiBell size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-600 mb-1">No notifications</h3>
              <p className="text-slate-500">You're all caught up! Check back later.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
              {notifications.map((notif) => (
                <div 
                  key={notif._id} 
                  className={`p-4 flex gap-4 transition-colors cursor-pointer ${notif.isRead ? 'bg-white opacity-70' : 'bg-slate-50'}`}
                  onClick={(e) => handleNotificationClick(e, notif)}
                >
                  <div className="mt-1 bg-white p-2 rounded-full border border-slate-200 shadow-sm shrink-0">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className={`text-sm ${notif.isRead ? 'font-semibold text-slate-600' : 'font-bold text-ink'}`}>
                        {notif.title}
                      </h4>
                      <span className="text-xs text-slate-500 whitespace-nowrap ml-4">
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className={`text-sm mt-1 ${notif.isRead ? 'text-slate-500' : 'text-slate-600'}`}>
                      {notif.message}
                    </p>
                  </div>
                  {!notif.isRead && (
                    <div className="shrink-0 flex items-center justify-center">
                      <button 
                        onClick={(e) => markAsRead(e, notif._id)}
                        className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-brand tooltip"
                        title="Mark as read"
                      >
                        <FiCheck size={16} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Notifications;
