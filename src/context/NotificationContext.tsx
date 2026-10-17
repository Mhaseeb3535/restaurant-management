import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

export interface AppNotification {
  id: number;
  title: string;
  message: string;
  category: string;
  link: string;
  is_read: boolean;
  created_at: string;
}

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  loading: boolean;
  refreshNotifications: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user, isLoggedIn } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const refreshNotifications = async () => {
    if (!isLoggedIn || !user) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    try {
      const res = await api.get("/notifications");
      const newNotifications = res.data.notifications || [];
      
      const oldNotificationIds = new Set(notifications.map(n => n.id));
      const justAdded = newNotifications.filter((n: AppNotification) => !oldNotificationIds.has(n.id));

      if (justAdded.length > 0) {
        if (justAdded.some((n: AppNotification) => n.category === 'order')) {
            window.dispatchEvent(new CustomEvent('data-refresh', { detail: { type: 'orders' } }));
        }
        if (justAdded.some((n: AppNotification) => n.category === 'reservation')) {
            window.dispatchEvent(new CustomEvent('data-refresh', { detail: { type: 'reservations' } }));
        }
      }

      setNotifications(newNotifications);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    refreshNotifications();
  }, [isLoggedIn, user?.id]);

  useEffect(() => {
    if (!isLoggedIn || !user) {
      return;
    }

    const intervalId = window.setInterval(() => {
      refreshNotifications();
    }, 30000);

    return () => window.clearInterval(intervalId);
  }, [isLoggedIn, user?.id]);

  const markAsRead = async (id: number) => {
    const targetNotification = notifications.find((notification) => notification.id === id);
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, is_read: true } : notification
      )
    );
    if (targetNotification && !targetNotification.is_read) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }

    try {
      await api.put(`/notifications/${id}/read`);
    } catch (error) {
      console.error("Failed to mark notification as read", error);
      await refreshNotifications();
    }
  };

  const markAllAsRead = async () => {
    const hadUnread = unreadCount > 0;
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, is_read: true }))
    );
    setUnreadCount(0);

    try {
      await api.put("/notifications/read-all");
    } catch (error) {
      console.error("Failed to mark all notifications as read", error);
      if (hadUnread) {
        await refreshNotifications();
      }
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        refreshNotifications,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
