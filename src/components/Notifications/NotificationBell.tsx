import { Badge, Dropdown, Spinner } from "react-bootstrap";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../../context/NotificationContext";
import "./Notifications.css";

interface NotificationBellProps {
  className?: string;
}

function formatRelativeTime(value: string) {
  const timestamp = new Date(value).getTime();
  const minutes = Math.max(1, Math.floor((Date.now() - timestamp) / 60000));

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function NotificationBell({ className = "" }: NotificationBellProps) {
  const navigate = useNavigate();
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();
  const latestNotifications = notifications.slice(0, 3);

  const handleOpenNotification = async (notificationId: number, link: string) => {
    await markAsRead(notificationId);
    navigate(link || "/customer/notifications");
  };

  return (
    <Dropdown align="end" className={`notification-bell ${className}`.trim()}>
      <Dropdown.Toggle
        variant="link"
        className="notification-bell__toggle text-decoration-none"
      >
        <FaBell />
        {unreadCount > 0 ? (
          <Badge bg="danger" pill className="notification-bell__badge">
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        ) : null}
      </Dropdown.Toggle>

      <Dropdown.Menu className="notification-bell__menu shadow border-0">
        <div className="notification-bell__header">
          <div>
            <strong>Notifications</strong>
            <div className="text-muted small">Latest customer updates</div>
          </div>
          {unreadCount > 0 ? (
            <button
              type="button"
              className="notification-bell__link"
              onClick={() => markAllAsRead()}
            >
              Mark all read
            </button>
          ) : null}
        </div>

        {loading ? (
          <div className="notification-bell__empty">
            <Spinner animation="border" size="sm" className="me-2" />
            Loading notifications...
          </div>
        ) : latestNotifications.length === 0 ? (
          <div className="notification-bell__empty">
            No notifications yet.
          </div>
        ) : (
          latestNotifications.map((notification) => (
            <Dropdown.Item
              key={notification.id}
              className={`notification-bell__item${notification.is_read ? "" : " is-unread"}`}
              onClick={() => handleOpenNotification(notification.id, notification.link)}
            >
              <div className="d-flex justify-content-between gap-3">
                <strong className="notification-bell__title">{notification.title}</strong>
                <small className="text-muted">{formatRelativeTime(notification.created_at)}</small>
              </div>
              <div className="notification-bell__message">{notification.message}</div>
            </Dropdown.Item>
          ))
        )}

        <div className="notification-bell__footer">
          <button
            type="button"
            className="notification-bell__view-all"
            onClick={() => navigate("/customer/notifications")}
          >
            View all notifications
          </button>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default NotificationBell;
