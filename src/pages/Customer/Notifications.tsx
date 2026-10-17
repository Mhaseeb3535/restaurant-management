import { Badge, Button, Card, Spinner } from "react-bootstrap";
import { FaBell, FaCheckCircle, FaInbox } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../../context/NotificationContext";

function formatDateTime(value: string) {
  return new Date(value).toLocaleString();
}

function Notifications() {
  const navigate = useNavigate();
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="warning" />
        <p className="mt-3 mb-0">Loading notifications...</p>
      </div>
    );
  }

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h3 className="mb-1">Notifications</h3>
          <p className="text-muted mb-0">
            Messages sent by admin and live updates from your orders and reservations.
          </p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <Badge bg="warning" text="dark" pill className="px-3 py-2">
            {unreadCount} unread
          </Badge>
          <Button
            variant="outline-dark"
            onClick={() => markAllAsRead()}
            disabled={unreadCount === 0}
          >
            <FaCheckCircle className="me-2" />
            Mark all read
          </Button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <Card className="shadow border-0 rounded-4 text-center py-5">
          <Card.Body>
            <FaInbox size={48} className="text-muted mb-3" />
            <h5 className="mb-2">No notifications yet</h5>
            <p className="text-muted mb-0">
              When admin replies to your reservation or updates your orders, they will appear here.
            </p>
          </Card.Body>
        </Card>
      ) : (
        <div className="d-grid gap-3">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`shadow-sm border-0 rounded-4 ${
                notification.is_read ? "bg-white" : "border border-warning-subtle"
              }`}
            >
              <Card.Body className="p-4">
                <div className="d-flex flex-wrap justify-content-between align-items-start gap-3">
                  <div className="d-flex gap-3">
                    <div
                      className="d-inline-flex align-items-center justify-content-center rounded-circle"
                      style={{
                        width: 48,
                        height: 48,
                        background: notification.is_read ? "#f3f4f6" : "#fff3cd",
                        color: notification.is_read ? "#6b7280" : "#b8860b",
                      }}
                    >
                      <FaBell />
                    </div>
                    <div>
                      <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                        <h5 className="mb-0">{notification.title}</h5>
                        {!notification.is_read ? <Badge bg="danger">New</Badge> : null}
                      </div>
                      <p className="text-muted mb-2">{notification.message}</p>
                      <small className="text-muted">{formatDateTime(notification.created_at)}</small>
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    {!notification.is_read ? (
                      <Button
                        variant="outline-warning"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                      >
                        Mark read
                      </Button>
                    ) : null}
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={async () => {
                        if (!notification.is_read) {
                          await markAsRead(notification.id);
                        }
                        navigate(notification.link || "/customer");
                      }}
                    >
                      Open
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}

export default Notifications;
