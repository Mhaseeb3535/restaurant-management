import { useState } from "react";
import { Badge, Button, Card, ListGroup } from "react-bootstrap";
import { FaBell, FaCheckCircle, FaTrash } from "react-icons/fa";

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: "info" | "warning" | "success" | "danger";
  read: boolean;
}

function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, title: "New Order", message: "New order #106 received for Table 4 - Chicken Biryani x2", time: "2 min ago", type: "info", read: false },
    { id: 2, title: "Order Ready", message: "Order #102 (Table 3) is marked as prepared", time: "15 min ago", type: "success", read: false },
    { id: 3, title: "Low Stock Alert", message: "Chicken stock is running low. Only 5 portions remaining.", time: "1 hour ago", type: "warning", read: false },
    { id: 4, title: "Shift Reminder", message: "Your shift ends at 2:00 PM. Please ensure handover.", time: "2 hours ago", type: "info", read: true },
    { id: 5, title: "Menu Update", message: "Today's special: Grilled Fish has been added to the menu.", time: "3 hours ago", type: "success", read: true },
    { id: 6, title: "System Alert", message: "POS system maintenance scheduled tonight at 11 PM.", time: "5 hours ago", type: "danger", read: true },
  ]);

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "info": return "primary";
      case "success": return "success";
      case "warning": return "warning";
      case "danger": return "danger";
      default: return "secondary";
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="mb-0">Notifications</h3>
          <small className="text-muted">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : "No unread notifications"}
          </small>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline-warning" size="sm" onClick={markAllAsRead}>
            <FaCheckCircle className="me-1" /> Mark All Read
          </Button>
        )}
      </div>

      <Card className="shadow border-0 rounded-4">
        <ListGroup variant="flush">
          {notifications.length === 0 ? (
            <ListGroup.Item className="text-center py-5">
              <FaBell size={40} className="text-muted mb-3" />
              <h5 className="text-muted">No notifications</h5>
            </ListGroup.Item>
          ) : (
            notifications.map((notif) => (
              <ListGroup.Item
                key={notif.id}
                className={`d-flex justify-content-between align-items-start p-4 ${!notif.read ? "bg-light" : ""}`}
              >
                <div className="d-flex gap-3 w-100">
                  <div className="mt-1">
                    <Badge bg={getTypeIcon(notif.type)} pill>
                      <FaBell />
                    </Badge>
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between">
                      <h6 className={`mb-1 ${!notif.read ? "fw-bold" : ""}`}>
                        {notif.title}
                        {!notif.read && (
                          <Badge bg="warning" className="ms-2" pill>
                            New
                          </Badge>
                        )}
                      </h6>
                      <small className="text-muted">{notif.time}</small>
                    </div>
                    <p className="mb-1 text-muted">{notif.message}</p>
                    <div className="d-flex gap-2 mt-2">
                      {!notif.read && (
                        <Button variant="outline-success" size="sm" onClick={() => markAsRead(notif.id)}>
                          <FaCheckCircle className="me-1" /> Mark Read
                        </Button>
                      )}
                      <Button variant="outline-danger" size="sm" onClick={() => deleteNotification(notif.id)}>
                        <FaTrash className="me-1" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </ListGroup.Item>
            ))
          )}
        </ListGroup>
      </Card>
    </>
  );
}

export default Notifications;

