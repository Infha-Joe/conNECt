import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";
import { useSocket } from "../hooks/useSocket";

const BadgeContext = createContext();

export const BadgeProvider = ({ children }) => {
  const { user } = useAuth();
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const fetchCounts = useCallback(async () => {
    if (!user) return;
    try {
      const [msgRes, notifRes] = await Promise.all([
        api.get("/messages/unread/count"),
        api.get("/notifications"),
      ]);
      setUnreadMessages(msgRes.data.unreadCount || 0);
      setUnreadNotifications(notifRes.data.unreadCount || 0);
    } catch (err) {
      console.error("Failed to fetch badge counts", err);
    }
  }, [user]);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  // Real-time socket listeners
  useSocket({
    "notification:new": () => {
      setUnreadNotifications((prev) => prev + 1);
    },
    "private_message:new": () => {
      setUnreadMessages((prev) => prev + 1);
    },
  });

  const decrementMessages = (count = 1) => {
    setUnreadMessages((prev) => Math.max(0, prev - count));
  };

  const decrementNotifications = (count = 1) => {
    setUnreadNotifications((prev) => Math.max(0, prev - count));
  };

  const clearMessagesCount = () => setUnreadMessages(0);
  const clearNotificationsCount = () => setUnreadNotifications(0);

  return (
    <BadgeContext.Provider
      value={{
        unreadMessages,
        unreadNotifications,
        decrementMessages,
        decrementNotifications,
        clearMessagesCount,
        clearNotificationsCount,
        fetchCounts, // In case we need to forcefully re-fetch
      }}
    >
      {children}
    </BadgeContext.Provider>
  );
};

export const useBadges = () => useContext(BadgeContext);
