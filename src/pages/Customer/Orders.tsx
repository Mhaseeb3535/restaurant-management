import { Alert, Badge, Button, Card, Col, Row, Table, Spinner } from "react-bootstrap";
import { FaEdit, FaEye } from "react-icons/fa";
import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";

interface Order {
  id: number;
  customer_name: string;
  items: { name: string; quantity: number }[];
  total: number | string;
  created_at: string;
  payment_method: "cod" | "online" | "card";
  payment_status: "pending" | "paid" | "refunded";
  status:
    | "Pending"
    | "Approved"
    | "Preparing"
    | "Ready"
    | "Delivered"
    | "Cancelled"
    | "Rejected"
    | "Refund Requested"
    | "Refunded";
}

function Orders() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = (location.state || {}) as {
    orderPlaced?: boolean;
    orderId?: number | null;
  };
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    const handleDataRefresh = (event: CustomEvent) => {
      if (event.detail?.type === 'orders') {
        fetchOrders();
      }
    };

    window.addEventListener('data-refresh', handleDataRefresh as EventListener);

    return () => {
      window.removeEventListener('data-refresh', handleDataRefresh as EventListener);
    };
  }, [fetchOrders]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending": return <Badge bg="warning">Pending</Badge>;
      case "Approved": return <Badge bg="info">Approved</Badge>;
      case "Preparing": return <Badge bg="primary">Preparing</Badge>;
      case "Ready": return <Badge bg="secondary">Ready</Badge>;
      case "Delivered": return <Badge bg="success">Delivered</Badge>;
      case "Cancelled": return <Badge bg="danger">Cancelled</Badge>;
      case "Rejected": return <Badge bg="danger">Rejected</Badge>;
      case "Refund Requested": return <Badge bg="warning">Refund Requested</Badge>;
      case "Refunded": return <Badge bg="secondary">Refunded</Badge>;
      default: return <Badge bg="light">Unknown</Badge>;
    }
  };
  
  const formatItems = (items: { name: string; quantity: number }[]) => {
    return items.map(item => `${item.name} x${item.quantity}`).join(', ');
  };

  const getOrderTotal = (total: number | string) => {
    const parsed = typeof total === "number" ? total : parseFloat(total);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" variant="warning" />
        <p>Loading Orders...</p>
      </div>
    );
  }

  return (
    <>
      <h3 className="mb-4">My Orders</h3>

      {locationState.orderPlaced ? (
        <Alert variant="success">
          Order placed successfully{locationState.orderId ? ` - #${locationState.orderId}` : ""}.
        </Alert>
      ) : null}

      <Row className="mb-4">
        <Col md={3}>
          <Card className="shadow border-0 text-center">
            <Card.Body>
              <h6 className="text-muted">Total Orders</h6>
              <h2>{orders.length}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow border-0 text-center">
            <Card.Body>
              <h6 className="text-muted">Delivered</h6>
              <h2 className="text-success">{orders.filter((o) => o.status === "Delivered").length}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow border-0 text-center">
            <Card.Body>
              <h6 className="text-muted">In Progress</h6>
              <h2 className="text-warning">{orders.filter((o) => ["Pending", "Approved", "Preparing", "Ready"].includes(o.status)).length}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow border-0 text-center">
            <Card.Body>
              <h6 className="text-muted">Total Spent</h6>
              <h2 className="text-danger">
                ${orders.reduce((sum, order) => sum + getOrderTotal(order.total), 0).toFixed(2)}
              </h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow border-0 rounded-4">
        <Card.Body>
          {orders.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <h5 className="mb-2">No orders yet</h5>
              <p className="mb-3">Add items to your cart and place your first order.</p>
              <Button variant="warning" onClick={() => navigate("/menu")}>
                Browse Menu
              </Button>
            </div>
          ) : (
            <Table hover responsive>
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td><strong>#{order.id}</strong></td>
                    <td>{formatItems(order.items)}</td>
                    <td>${getOrderTotal(order.total).toFixed(2)}</td>
                    <td className="text-capitalize">{order.payment_method}</td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                    <td>{getStatusBadge(order.status)}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => navigate(`/customer/orders/${order.id}`)}
                      >
                        {order.status === "Pending" ? <FaEdit className="me-1" /> : <FaEye className="me-1" />}
                        {order.status === "Pending" ? "Edit" : "View"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </>
  );
}

export default Orders;

