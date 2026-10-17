import { useState } from "react";
import { Badge, Button, Card, Col, Row, Table } from "react-bootstrap";
import AnimatedSection from "../../../components/AnimatedSection/AnimatedSection";
import AnimatedCard from "../../../components/AnimatedCard/AnimatedCard";
import AnimatedRow from "../../../components/AnimatedRow/AnimatedRow";

interface KitchenOrder {
  id: number;
  table: number;
  items: string;
  quantity: number;
  server: string;
  time: string;
  status: "Pending" | "Preparing" | "Ready" | "Served";
}

function Orders() {
  const [orders, setOrders] = useState<KitchenOrder[]>([
    { id: 101, table: 5, items: "Chicken Biryani", quantity: 2, server: "Ahmed", time: "12:30 PM", status: "Pending" },
    { id: 102, table: 3, items: "Zinger Burger + Fries", quantity: 1, server: "Sara", time: "12:35 PM", status: "Preparing" },
    { id: 103, table: 7, items: "Pizza Margherita", quantity: 1, server: "Ali", time: "12:40 PM", status: "Pending" },
    { id: 104, table: 2, items: "Grilled Fish", quantity: 2, server: "Ahmed", time: "12:45 PM", status: "Ready" },
    { id: 105, table: 6, items: "Pasta Alfredo", quantity: 1, server: "Sara", time: "12:50 PM", status: "Served" },
  ]);

  const updateStatus = (id: number, newStatus: KitchenOrder["status"]) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending": return <Badge bg="warning">Pending</Badge>;
      case "Preparing": return <Badge bg="info">Preparing</Badge>;
      case "Ready": return <Badge bg="success">Ready</Badge>;
      case "Served": return <Badge bg="secondary">Served</Badge>;
      default: return <Badge bg="light">Unknown</Badge>;
    }
  };

  const pendingCount = orders.filter((o) => o.status === "Pending").length;
  const preparingCount = orders.filter((o) => o.status === "Preparing").length;
  const readyCount = orders.filter((o) => o.status === "Ready").length;
  const servedCount = orders.filter((o) => o.status === "Served").length;

  return (
    <>
      <AnimatedSection>
        <Row className="mb-4">
          {[
            { label: "Pending", count: pendingCount, color: "warning" },
            { label: "Preparing", count: preparingCount, color: "info" },
            { label: "Ready", count: readyCount, color: "success" },
            { label: "Served", count: servedCount, color: "secondary" },
          ].map((item, i) => (
            <Col md={3} key={item.label}>
              <AnimatedCard index={i}>
                <Card className="shadow border-0 text-center">
                  <Card.Body>
                    <h6 className="text-muted">{item.label}</h6>
                    <h2 className={`text-${item.color}`}>{item.count}</h2>
                  </Card.Body>
                </Card>
              </AnimatedCard>
            </Col>
          ))}
        </Row>
      </AnimatedSection>

      <AnimatedSection delay={0.2}>
        <Card className="shadow border-0 rounded-4">
          <Card.Body>
            <h3 className="mb-4">Kitchen Orders Queue</h3>
            <Table hover responsive>
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Table</th>
                  <th>Items</th>
                  <th>Qty</th>
                  <th>Server</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <AnimatedRow key={order.id} index={index}>
                    <td><strong>#{order.id}</strong></td>
                    <td>Table {order.table}</td>
                    <td>{order.items}</td>
                    <td>{order.quantity}</td>
                    <td>{order.server}</td>
                    <td>{order.time}</td>
                    <td>{getStatusBadge(order.status)}</td>
                    <td>
                      {order.status === "Pending" && (
                        <Button size="sm" variant="info" className="me-1" onClick={() => updateStatus(order.id, "Preparing")}>
                          Start Prep
                        </Button>
                      )}
                      {order.status === "Preparing" && (
                        <Button size="sm" variant="success" className="me-1" onClick={() => updateStatus(order.id, "Ready")}>
                          Mark Ready
                        </Button>
                      )}
                      {order.status === "Ready" && (
                        <Button size="sm" variant="secondary" onClick={() => updateStatus(order.id, "Served")}>
                          Mark Served
                        </Button>
                      )}
                      {order.status === "Served" && (
                        <Badge bg="light" text="dark">Completed</Badge>
                      )}
                    </td>
                  </AnimatedRow>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </AnimatedSection>
    </>
  );
}

export default Orders;
