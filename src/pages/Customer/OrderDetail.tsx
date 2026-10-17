import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import {
  FaArrowLeft,
  FaBox,
  FaCheckCircle,
  FaClock,
  FaEdit,
  FaExclamationTriangle,
  FaMinus,
  FaPrint,
  FaPlus,
  FaTimesCircle,
  FaTruck,
  FaUtensils,
} from "react-icons/fa";
import api from "../../services/api";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
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
  screenshot: string;
  refund_reason: string;
  created_at: string;
  updated_at: string;
}

const orderSteps = ["Pending", "Approved", "Preparing", "Ready", "Delivered"];

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

function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [refundReason, setRefundReason] = useState("");
  const [refunding, setRefunding] = useState(false);
  const [refundSuccess, setRefundSuccess] = useState("");
  const [editSuccess, setEditSuccess] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editItems, setEditItems] = useState<OrderItem[]>([]);
  const [editPaymentMethod, setEditPaymentMethod] = useState<Order["payment_method"]>("cod");
  const [editDeliveryAddress, setEditDeliveryAddress] = useState("");
  const [editSpecialInstructions, setEditSpecialInstructions] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (err: unknown) {
        setError(getApiErrorMessage(err, "Failed to load order"));
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  const handleRefundRequest = async () => {
    if (!refundReason.trim()) {
      return;
    }

    try {
      setRefunding(true);
      await api.put(`/orders/${id}/refund`, { refund_reason: refundReason.trim() });
      setRefundSuccess("Refund request submitted successfully.");
      setShowRefundModal(false);
      setRefundReason("");

      const res = await api.get(`/orders/${id}`);
      setOrder(res.data);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Failed to request refund"));
    } finally {
      setRefunding(false);
    }
  };

  const openEditModal = () => {
    if (!order) {
      return;
    }

    setEditItems(order.items.map((item) => ({ ...item })));
    setEditPaymentMethod(order.payment_method);
    setEditDeliveryAddress(order.delivery_address || "");
    setEditSpecialInstructions(order.special_instructions || "");
    setShowEditModal(true);
  };

  const updateEditQuantity = (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      setEditItems((prev) => prev.filter((item) => item.id !== itemId));
      return;
    }

    setEditItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const handleEditOrder = async () => {
    if (!order) {
      return;
    }

    if (!editDeliveryAddress.trim()) {
      setError("Delivery address is required");
      return;
    }

    if (editItems.length === 0) {
      setError("Add at least one item to keep the order");
      return;
    }

    const subtotal = editItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = subtotal + subtotal * 0.1;

    try {
      setEditSubmitting(true);
      const response = await api.put(`/orders/${order.id}`, {
        items: editItems,
        total,
        payment_method: editPaymentMethod,
        delivery_address: editDeliveryAddress,
        special_instructions: editSpecialInstructions,
      });
      setOrder(response.data);
      setEditSuccess("Order updated successfully.");
      setShowEditModal(false);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Failed to update order"));
    } finally {
      setEditSubmitting(false);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <FaCheckCircle />;
      case "Preparing":
        return <FaUtensils />;
      case "Ready":
        return <FaBox />;
      case "Delivered":
        return <FaTruck />;
      case "Cancelled":
      case "Rejected":
        return <FaTimesCircle />;
      default:
        return <FaClock />;
    }
  };

  const getPaymentMethodLabel = (method: Order["payment_method"]) => {
    switch (method) {
      case "cod":
        return "Cash on Delivery";
      case "online":
        return "Online Transfer";
      case "card":
        return "Card Payment";
      default:
        return method;
    }
  };

  const canRequestRefund =
    order &&
    (order.payment_method === "online" || order.payment_method === "card") &&
    ["Approved", "Preparing", "Ready", "Delivered"].includes(order.status) &&
    order.payment_status !== "refunded";
  const canEditOrder = order?.status === "Pending";

  if (loading) {
    return (
      <Container className="py-4 text-center">
        <Spinner animation="border" variant="warning" />
        <p className="mt-2">Loading order details...</p>
      </Container>
    );
  }

  if (error && !order) {
    return (
      <Container className="py-4">
        <Alert variant="danger">{error}</Alert>
        <Button variant="warning" onClick={() => navigate("/customer/orders")}>
          Back to Orders
        </Button>
      </Container>
    );
  }

  if (!order) {
    return null;
  }

  const orderTotal =
    typeof order.total === "number" ? order.total : parseFloat(order.total);
  const safeOrderTotal = Number.isFinite(orderTotal) ? orderTotal : 0;
  const subtotal = safeOrderTotal / 1.1;
  const tax = safeOrderTotal - subtotal;
  const currentStepIndex = orderSteps.indexOf(order.status);

  return (
    <Container className="py-4">
      <style>
        {`
          @media print {
            .no-print {
              display: none !important;
            }

            .card {
              border: 1px solid #ddd !important;
              box-shadow: none !important;
            }

            body {
              background: #fff !important;
            }
          }
        `}
      </style>

      <div className="d-flex justify-content-between align-items-center mb-4 no-print">
        <Button
          variant="link"
          className="text-decoration-none text-muted p-0"
          onClick={() => navigate("/customer/orders")}
        >
          <FaArrowLeft className="me-1" /> Back to Orders
        </Button>
        <Button variant="outline-secondary" size="sm" onClick={() => window.print()}>
          <FaPrint className="me-1" /> Print Slip
        </Button>
      </div>

      {refundSuccess && (
        <Alert
          variant="success"
          dismissible
          onClose={() => setRefundSuccess("")}
          className="no-print"
        >
          {refundSuccess}
        </Alert>
      )}

      {editSuccess && (
        <Alert
          variant="success"
          dismissible
          onClose={() => setEditSuccess("")}
          className="no-print"
        >
          {editSuccess}
        </Alert>
      )}

      {error && (
        <Alert
          variant="danger"
          dismissible
          onClose={() => setError("")}
          className="no-print"
        >
          {error}
        </Alert>
      )}

      <Card className="shadow border-0 rounded-4">
        <Card.Body className="p-4">
          <div className="text-center border-bottom pb-3 mb-4">
            <img src="/icon.png" alt="Diego Kitchen Restaurant" height="50" className="mb-2" />
            <h4 className="fw-bold mb-0">Diego Kitchen Restaurant</h4>
            <small className="text-muted">Real food Real flavor</small>
            <div className="mt-3 d-flex justify-content-center gap-2 flex-wrap">
              <Badge bg="light" text="dark">
                Order #{order.id}
              </Badge>
              {getStatusBadge(order.status)}
            </div>
          </div>

          <div className="d-flex justify-content-center gap-3 mb-4 flex-wrap no-print">
            {orderSteps.map((step, index) => {
              const isActive =
                currentStepIndex >= index &&
                !["Cancelled", "Rejected", "Refund Requested", "Refunded"].includes(order.status);

              return (
                <div key={step} className="text-center" style={{ minWidth: 80 }}>
                  <div
                    className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-1 ${
                      isActive ? "bg-warning text-dark" : "bg-light text-muted"
                    }`}
                    style={{ width: 38, height: 38 }}
                  >
                    {getStatusIcon(step)}
                  </div>
                  <small className={isActive ? "fw-bold" : "text-muted"}>{step}</small>
                </div>
              );
            })}
          </div>

          <h6 className="fw-bold mb-3">Order Items</h6>
          <Table borderless size="sm" className="mb-4">
            <thead className="bg-light">
              <tr>
                <th>Item</th>
                <th className="text-center">Qty</th>
                <th className="text-end">Price</th>
                <th className="text-end">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: 35, height: 35, objectFit: "cover" }}
                          className="rounded"
                        />
                      ) : null}
                      <span>{item.name}</span>
                    </div>
                  </td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-end">${item.price.toFixed(2)}</td>
                  <td className="text-end fw-bold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="border-top pt-3">
            <div className="d-flex justify-content-between mb-1">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-1">
              <span>Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between fw-bold fs-5">
              <span>Total</span>
              <span className="text-warning">${safeOrderTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="border-top pt-3 mt-3">
            <Row className="g-3">
              <Col md={6}>
                <small className="text-muted d-block">Customer</small>
                <p className="mb-0">{order.customer_name}</p>
              </Col>
              <Col md={6}>
                <small className="text-muted d-block">Payment Method</small>
                <p className="mb-0">{getPaymentMethodLabel(order.payment_method)}</p>
              </Col>
              <Col md={6}>
                <small className="text-muted d-block">Payment Status</small>
                <p className="mb-0 text-capitalize">{order.payment_status}</p>
              </Col>
              <Col md={6}>
                <small className="text-muted d-block">Order Date</small>
                <p className="mb-0">{new Date(order.created_at).toLocaleString()}</p>
              </Col>
              <Col xs={12}>
                <small className="text-muted d-block">Delivery Address</small>
                <p className="mb-0">{order.delivery_address || "N/A"}</p>
              </Col>
              {order.special_instructions ? (
                <Col xs={12}>
                  <small className="text-muted d-block">Special Instructions</small>
                  <p className="mb-0">{order.special_instructions}</p>
                </Col>
              ) : null}
              {order.refund_reason ? (
                <Col xs={12}>
                  <small className="text-muted d-block">Refund Reason</small>
                  <p className="mb-0">{order.refund_reason}</p>
                </Col>
              ) : null}
            </Row>
          </div>

          <div className="text-center border-top pt-3 mt-4">
            <small className="text-muted">Thank you for your order!</small>
          </div>
        </Card.Body>
      </Card>

      <div className="d-flex gap-2 mt-3 no-print">
        {canEditOrder ? (
          <Button
            variant="outline-primary"
            onClick={openEditModal}
            className="flex-fill"
          >
            <FaEdit className="me-1" /> Edit Order
          </Button>
        ) : null}
        {canRequestRefund ? (
          <Button
            variant="outline-warning"
            onClick={() => setShowRefundModal(true)}
            className="flex-fill"
          >
            <FaExclamationTriangle className="me-1" /> Request Refund
          </Button>
        ) : null}
        <Button
          variant="warning"
          onClick={() => navigate("/customer/orders")}
          className="flex-fill"
        >
          Back to My Orders
        </Button>
      </div>

      <Modal show={showRefundModal} onHide={() => setShowRefundModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Request Refund</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="info">
            Refund requests are only available for online or card payments and will be
            reviewed by the admin.
          </Alert>
          <Form.Group>
            <Form.Label>
              Reason for Refund <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Please explain why you want a refund..."
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRefundModal(false)}>
            Cancel
          </Button>
          <Button
            variant="warning"
            onClick={handleRefundRequest}
            disabled={refunding || !refundReason.trim()}
          >
            {refunding ? (
              <>
                <Spinner animation="border" size="sm" className="me-1" />
                Submitting...
              </>
            ) : (
              "Submit Refund Request"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Edit Pending Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="info">
            You can edit this order only while its status is pending.
          </Alert>

          <h6 className="fw-bold mb-3">Items</h6>
          {editItems.map((item) => (
            <div
              key={item.id}
              className="d-flex align-items-center justify-content-between border rounded p-2 mb-2"
            >
              <div>
                <div className="fw-semibold">{item.name}</div>
                <small className="text-muted">${item.price.toFixed(2)} each</small>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Button
                  size="sm"
                  variant="outline-secondary"
                  onClick={() => updateEditQuantity(item.id, item.quantity - 1)}
                >
                  <FaMinus />
                </Button>
                <span className="fw-bold">{item.quantity}</span>
                <Button
                  size="sm"
                  variant="outline-secondary"
                  onClick={() => updateEditQuantity(item.id, item.quantity + 1)}
                >
                  <FaPlus />
                </Button>
              </div>
            </div>
          ))}

          <Form.Group className="mb-3 mt-3">
            <Form.Label>Delivery Address</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={editDeliveryAddress}
              onChange={(e) => setEditDeliveryAddress(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Special Instructions</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={editSpecialInstructions}
              onChange={(e) => setEditSpecialInstructions(e.target.value)}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Payment Method</Form.Label>
            <Form.Select
              value={editPaymentMethod}
              onChange={(e) =>
                setEditPaymentMethod(e.target.value as Order["payment_method"])
              }
            >
              <option value="cod">Cash on Delivery</option>
              <option value="online">Online Transfer</option>
              <option value="card">Card Payment</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleEditOrder}
            disabled={editSubmitting || editItems.length === 0}
          >
            {editSubmitting ? (
              <>
                <Spinner animation="border" size="sm" className="me-1" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default OrderDetail;
