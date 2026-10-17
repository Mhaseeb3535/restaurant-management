import { Card } from "react-bootstrap";
import { FaBell } from "react-icons/fa";

const notifications = [
  { id: 1, message: "New order received #ORD-006", time: "2 min ago" },
  { id: 2, message: "Table 5 reservation confirmed", time: "10 min ago" },
  { id: 3, message: "Low stock alert: Italian Pizza", time: "30 min ago" },
  { id: 4, message: "Staff shift change request", time: "1 hour ago" },
];

function NotificationCard() {
  return (
    <Card className="shadow border-0 rounded-4 p-3">
      <div className="d-flex align-items-center gap-2 mb-3">
        <FaBell className="text-warning" size={20} />
        <h5 className="mb-0">Notifications</h5>
      </div>
      {notifications.map((n) => (
        <div key={n.id} className="d-flex align-items-start gap-3 mb-3 pb-2 border-bottom">
          <div>{n.message}</div>
          <small className="text-muted">{n.time}</small>
        </div>
      ))}
    </Card>
  );
}

export default NotificationCard;
