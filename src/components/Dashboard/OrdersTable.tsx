import { Table, Badge } from "react-bootstrap";

const orders = [
  { id: "#ORD-001", customer: "John Doe", items: "Grilled Steak", total: "$24.99", status: "Completed", time: "10:30 AM" },
  { id: "#ORD-002", customer: "Sarah Khan", items: "Italian Pizza", total: "$18.50", status: "Preparing", time: "11:15 AM" },
  { id: "#ORD-003", customer: "Ali Raza", items: "Creamy Pasta", total: "$16.00", status: "Pending", time: "11:45 AM" },
  { id: "#ORD-004", customer: "Emma Wilson", items: "Chocolate Dessert", total: "$12.00", status: "Completed", time: "12:00 PM" },
  { id: "#ORD-005", customer: "Mike Johnson", items: "Diego Beef Steak", total: "$24.99", status: "Preparing", time: "12:20 PM" },
];

const statusVariant: Record<string, string> = {
  Completed: "success",
  Preparing: "warning",
  Pending: "danger",
};

function OrdersTable() {
  return (
    <div className="bg-white rounded-4 shadow p-4">
      <h5 className="mb-3">Recent Orders</h5>
      <Table hover responsive>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customer}</td>
              <td>{order.items}</td>
              <td>{order.total}</td>
              <td>
                <Badge bg={statusVariant[order.status]}>{order.status}</Badge>
              </td>
              <td>{order.time}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default OrdersTable;
