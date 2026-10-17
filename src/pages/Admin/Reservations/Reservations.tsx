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

interface Reservation {
  id: number;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  dining_area: string;
  occasion: string;
  special_request: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled" | "Rejected";
  admin_message: string;
  available_capacity: number | null;
  alternative_date: string | null;
  alternative_time: string | null;
  created_at: string;
}

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

function Reservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    status: "Confirmed" as Reservation["status"],
    adminMessage: "",
    alternativeDate: "",
    alternativeTime: "",
    availableCapacity: "",
  });

  const fetchReservations = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/reservations");
      setReservations(res.data);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Failed to load reservations"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  useEffect(() => {
    const handleDataRefresh = (event: CustomEvent) => {
      if (event.detail?.type === 'reservations') {
        fetchReservations();
      }
    };

    window.addEventListener('data-refresh', handleDataRefresh as EventListener);

    return () => {
      window.removeEventListener('data-refresh', handleDataRefresh as EventListener);
    };
  }, [fetchReservations]);

  const openReviewModal = (
    reservation: Reservation,
    status: Reservation["status"]
  ) => {
    setSelectedReservation(reservation);
    setReviewForm({
      status,
      adminMessage: reservation.admin_message || "",
      alternativeDate: reservation.alternative_date || "",
      alternativeTime: reservation.alternative_time || "",
      availableCapacity:
        reservation.available_capacity !== null ? String(reservation.available_capacity) : "",
    });
    setShowReviewModal(true);
  };

  const submitReview = async () => {
    if (!selectedReservation) {
      return;
    }

    try {
      setSubmitting(true);
      await api.put(`/reservations/${selectedReservation.id}/review`, {
        status: reviewForm.status,
        admin_message: reviewForm.adminMessage,
        alternative_date: reviewForm.alternativeDate || null,
        alternative_time: reviewForm.alternativeTime || null,
        available_capacity: reviewForm.availableCapacity || null,
      });
      setShowReviewModal(false);
      setSelectedReservation(null);
      await fetchReservations();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Failed to update reservation"));
    } finally {
      setSubmitting(false);
    }
  };

  const markCompleted = async (reservationId: number) => {
    try {
      setSubmitting(true);
      await api.put(`/reservations/${reservationId}/status`, { status: "Completed" });
      await fetchReservations();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Failed to update reservation"));
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: Reservation["status"]) => {
    switch (status) {
      case "Pending":
        return <Badge bg="warning">Pending</Badge>;
      case "Confirmed":
        return <Badge bg="success">Confirmed</Badge>;
      case "Completed":
        return <Badge bg="info">Completed</Badge>;
      case "Cancelled":
        return <Badge bg="secondary">Cancelled</Badge>;
      case "Rejected":
        return <Badge bg="danger">Rejected</Badge>;
      default:
        return <Badge bg="light">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" variant="warning" />
        <p className="mt-2">Loading reservations...</p>
      </div>
    );
  }

  const pendingCount = reservations.filter((reservation) => reservation.status === "Pending").length;
  const confirmedCount = reservations.filter((reservation) => reservation.status === "Confirmed").length;
  const rejectedCount = reservations.filter((reservation) => reservation.status === "Rejected").length;

  return (
    <>
      <h3 className="mb-4">Reservation Requests</h3>

      {error ? (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      ) : null}

      <Row className="mb-4">
        <Col md={3}>
          <Card className="shadow border-0 text-center">
            <Card.Body>
              <h6 className="text-muted">Total Requests</h6>
              <h2>{reservations.length}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow border-0 text-center">
            <Card.Body>
              <h6 className="text-muted">Pending</h6>
              <h2 className="text-warning">{pendingCount}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow border-0 text-center">
            <Card.Body>
              <h6 className="text-muted">Confirmed</h6>
              <h2 className="text-success">{confirmedCount}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow border-0 text-center">
            <Card.Body>
              <h6 className="text-muted">Rejected</h6>
              <h2 className="text-danger">{rejectedCount}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow border-0 rounded-4">
        <Card.Body>
          <Table hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Guest</th>
                <th>Schedule</th>
                <th>Party</th>
                <th>Preference</th>
                <th>Status</th>
                <th>Admin Note</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td>
                    <strong>#{reservation.id}</strong>
                  </td>
                  <td>
                    <div>{reservation.name}</div>
                    <div className="text-muted small">{reservation.email}</div>
                    <div className="text-muted small">{reservation.phone || "No phone"}</div>
                  </td>
                  <td>
                    <div>{new Date(reservation.date).toLocaleDateString()}</div>
                    <div className="text-muted small">{reservation.time}</div>
                  </td>
                  <td>
                    <div>{reservation.guests} guests</div>
                    <div className="text-muted small">{reservation.occasion || "General"}</div>
                  </td>
                  <td>
                    <div>{reservation.dining_area || "N/A"}</div>
                    <div className="text-muted small">
                      {reservation.special_request || "No special request"}
                    </div>
                  </td>
                  <td>{getStatusBadge(reservation.status)}</td>
                  <td style={{ minWidth: 220 }}>
                    {reservation.admin_message ? (
                      <div className="small">{reservation.admin_message}</div>
                    ) : (
                      <span className="text-muted small">No admin message yet</span>
                    )}
                    {reservation.alternative_date || reservation.alternative_time ? (
                      <div className="text-muted small mt-2">
                        Alt:{" "}
                        {reservation.alternative_date
                          ? new Date(reservation.alternative_date).toLocaleDateString()
                          : "N/A"}{" "}
                        {reservation.alternative_time || ""}
                      </div>
                    ) : null}
                    {reservation.available_capacity !== null ? (
                      <div className="text-muted small">
                        Space: {reservation.available_capacity} guests
                      </div>
                    ) : null}
                  </td>
                  <td style={{ minWidth: 260 }}>
                    <div className="d-flex flex-wrap gap-2">
                      {reservation.status === "Pending" ? (
                        <>
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => openReviewModal(reservation, "Confirmed")}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => openReviewModal(reservation, "Rejected")}
                          >
                            Reject
                          </Button>
                        </>
                      ) : null}
                      {reservation.status === "Confirmed" ? (
                        <Button
                          size="sm"
                          variant="outline-primary"
                          disabled={submitting}
                          onClick={() => markCompleted(reservation.id)}
                        >
                          Mark Completed
                        </Button>
                      ) : null}
                      {(reservation.status === "Rejected" || reservation.status === "Cancelled") ? (
                        <Button
                          size="sm"
                          variant="outline-secondary"
                          onClick={() => openReviewModal(reservation, "Confirmed")}
                        >
                          Re-open
                        </Button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {reviewForm.status === "Confirmed" ? "Approve Reservation" : "Reject Reservation"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={reviewForm.status}
              onChange={(e) =>
                setReviewForm((prev) => ({
                  ...prev,
                  status: e.target.value as Reservation["status"],
                }))
              }
            >
              <option value="Confirmed">Confirmed</option>
              <option value="Rejected">Rejected</option>
              <option value="Cancelled">Cancelled</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Admin Message</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Share confirmation details or explain the rejection."
              value={reviewForm.adminMessage}
              onChange={(e) =>
                setReviewForm((prev) => ({ ...prev, adminMessage: e.target.value }))
              }
            />
          </Form.Group>

          <Row>
            <Col md={6} className="mb-3">
              <Form.Label>Alternative Date</Form.Label>
              <Form.Control
                type="date"
                value={reviewForm.alternativeDate}
                onChange={(e) =>
                  setReviewForm((prev) => ({ ...prev, alternativeDate: e.target.value }))
                }
              />
            </Col>
            <Col md={6} className="mb-3">
              <Form.Label>Alternative Time</Form.Label>
              <Form.Control
                type="time"
                value={reviewForm.alternativeTime}
                onChange={(e) =>
                  setReviewForm((prev) => ({ ...prev, alternativeTime: e.target.value }))
                }
              />
            </Col>
          </Row>

          <Form.Group>
            <Form.Label>Available Space</Form.Label>
            <Form.Control
              type="number"
              min="1"
              placeholder="How many guests can be accommodated?"
              value={reviewForm.availableCapacity}
              onChange={(e) =>
                setReviewForm((prev) => ({ ...prev, availableCapacity: e.target.value }))
              }
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReviewModal(false)}>
            Cancel
          </Button>
          <Button
            variant={reviewForm.status === "Rejected" ? "danger" : "success"}
            onClick={submitReview}
            disabled={
              submitting ||
              (reviewForm.status === "Rejected" && !reviewForm.adminMessage.trim())
            }
          >
            {submitting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Saving...
              </>
            ) : reviewForm.status === "Rejected" ? (
              "Reject and Email"
            ) : (
              "Approve and Email"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Reservations;
