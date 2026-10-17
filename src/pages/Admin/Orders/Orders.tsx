import { useEffect, useState, useCallback } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import api from "../../../services/api";

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
}

interface Order {
  id: number;
  customer_name: string;
  items: OrderItem[];
  total: number | string;
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
  payment_method: "cod" | "online" | "card";
  payment_status: "pending" | "paid" | "refunded";
  delivery_address: string;
  special_instructions: string;
  refund_reason: string;
  created_at: string;
  screenshot: string | null;
}

const statusOptions: Order["status"][] = [
  "Pending",
  "Approved",
  "Preparing",
  "Ready",
  "Delivered",
  "Cancelled",
  "Rejected",
  "Refund Requested",
  "Refunded",
];

const paymentOptions: Order["payment_status"][] = ["pending", "paid", "refunded"];

function getApiErrorMessage(error: unknown, fallback: string) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: unknown }).response === "object" &&
    (error as { response: { data?: unknown } }).response !== null &&
    "data" in (error as { response: { data?: unknown } }).response &&
    typeof (error as { response: { data?: { error?: unknown } } }).response.data?.error ===
      "string"
  ) {
    return (error as { response: { data: { error: string } } }).response.data.error;
  }

  return error instanceof Error ? error.message : fallback;
}

function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [showScreenshot, setShowScreenshot] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders");
      setOrders(res.data);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Failed to load orders"));
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

  const updateOrderStatus = async (orderId: number, status: Order["status"]) => {
    try {
      setUpdatingId(orderId);
      await api.put(`/orders/${orderId}/status`, { status });
      await fetchOrders();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Failed to update order status"));
    } finally {
      setUpdatingId(null);
    }
  };

  const updatePaymentStatus = async (
    orderId: number,
    paymentStatus: Order["payment_status"]
  ) => {
    try {
      setUpdatingId(orderId);
      await api.put(`/orders/${orderId}/payment-status`, {
        payment_status: paymentStatus,
      });
      await fetchOrders();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Failed to update payment status"));
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "Pending":
        return <Badge bg="warning">Pending</Badge>;
      case "Approved":
        return <Badge bg="info">Approved</Badge>;
      case "Preparing":
        return <Badge bg="primary">Preparing</Badge>;
      case "Ready":
        return <Badge bg="secondary">Ready</Badge>;
      case "Delivered":
        return <Badge bg="success">Delivered</Badge>;
      case "Cancelled":
        return <Badge bg="danger">Cancelled</Badge>;
      case "Rejected":
        return <Badge bg="danger">Rejected</Badge>;
      case "Refund Requested":
        return <Badge bg="warning">Refund Requested</Badge>;
      case "Refunded":
        return <Badge bg="dark">Refunded</Badge>;
      default:
        return <Badge bg="light">Unknown</Badge>;
    }
  };

  const formatItems = (items: OrderItem[]) =>
    items.map((item) => `${item.name} x${item.quantity}`).join(", ");

  const getOrderTotal = (total: number | string) => {
    const parsed = typeof total === "number" ? total : parseFloat(total);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" variant="warning" />
        <p className="mt-2">Loading orders...</p>
      </div>
    );
  }

  return (
    <>
      <h3 className="mb-4">Online Orders</h3>

      {error ? (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
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
              <h6 className="text-muted">Pending Review</h6>
              <h2 className="text-warning">
                {orders.filter((order) => order.status === "Pending").length}
              </h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow border-0 text-center">
            <Card.Body>
              <h6 className="text-muted">Refund Requests</h6>
              <h2 className="text-danger">
                {orders.filter((order) => order.status === "Refund Requested").length}
              </h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow border-0 text-center">
            <Card.Body>
              <h6 className="text-muted">Revenue</h6>
              <h2 className="text-success">
                ${orders.reduce((sum, order) => sum + getOrderTotal(order.total), 0).toFixed(2)}
              </h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow border-0 rounded-4">
        <Card.Body>
          <Table hover responsive>
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Address</th>
                <th>Refund</th>
                <th>Screenshot</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const isUpdating = updatingId === order.id;

                return (
                  <tr key={order.id}>
                    <td>
                      <strong>#{order.id}</strong>
                      <div className="text-muted small">
                        {new Date(order.created_at).toLocaleString()}
                      </div>
                    </td>
                    <td>{order.customer_name}</td>
                    <td>
                      <div>{formatItems(order.items)}</div>
                      {order.special_instructions ? (
                        <div className="text-muted small mt-1">
                          Note: {order.special_instructions}
                        </div>
                      ) : null}
                    </td>
                    <td>${getOrderTotal(order.total).toFixed(2)}</td>
                    <td>
                      <div className="text-capitalize">{order.payment_method}</div>
                      <Form.Select
                        size="sm"
                        className="mt-2"
                        value={order.payment_status}
                        disabled={isUpdating}
                        onChange={(e) =>
                          updatePaymentStatus(
                            order.id,
                            e.target.value as Order["payment_status"]
                          )
                        }
                      >
                        {paymentOptions.map((paymentOption) => (
                          <option key={paymentOption} value={paymentOption}>
                            {paymentOption}
                          </option>
                        ))}
                      </Form.Select>
                    </td>
                    <td>
                      <div>{getStatusBadge(order.status)}</div>
                      <Form.Select
                        size="sm"
                        className="mt-2"
                        value={order.status}
                        disabled={isUpdating}
                        onChange={(e) =>
                          updateOrderStatus(order.id, e.target.value as Order["status"])
                        }
                      >
                        {statusOptions.map((statusOption) => (
                          <option key={statusOption} value={statusOption}>
                            {statusOption}
                          </option>
                        ))}
                      </Form.Select>
                    </td>
                    <td style={{ minWidth: 180 }}>{order.delivery_address || "N/A"}</td>
                    <td style={{ minWidth: 160 }}>
                      {order.refund_reason ? (
                        <div className="small">{order.refund_reason}</div>
                      ) : (
                        <span className="text-muted small">No refund request</span>
                      )}
                    </td>
                    <td>
                      {order.screenshot ? (
                        <Button
                          size="sm"
                          variant="outline-info"
                          onClick={() => setShowScreenshot(order.screenshot)}
                        >
                          View
                        </Button>
                      ) : (
                        <span className="text-muted small">N/A</span>
                      )}
                    </td>
                    <td style={{ minWidth: 220 }}>
                      <div className="d-flex flex-wrap gap-2">
                        {order.status === "Pending" ? (
                          <>
                            <Button
                              size="sm"
                              variant="success"
                              disabled={isUpdating}
                              onClick={() => updateOrderStatus(order.id, "Approved")}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              disabled={isUpdating}
                              onClick={() => updateOrderStatus(order.id, "Rejected")}
                            >
                              Reject
                            </Button>
                          </>
                        ) : null}

                        {order.status === "Refund Requested" ? (
                          <>
                            <Button
                              size="sm"
                              variant="warning"
                              disabled={isUpdating}
                              onClick={() => updatePaymentStatus(order.id, "refunded")}
                            >
                              Approve Refund
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-secondary"
                              disabled={isUpdating}
                              onClick={() => updateOrderStatus(order.id, "Approved")}
                            >
                              Keep Order
                            </Button>
                          </>
                        ) : null}

                        {isUpdating ? (
                          <Spinner animation="border" size="sm" variant="warning" />
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={!!showScreenshot} onHide={() => setShowScreenshot(null)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Payment Screenshot</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showScreenshot ? (
            <img src={`http://localhost:5000${showScreenshot}`} alt="Payment Screenshot" className="img-fluid" />
          ) : (
            <p>No screenshot available.</p>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Orders;
