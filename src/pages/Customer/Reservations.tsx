import { useEffect, useMemo, useState, useCallback } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Modal,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import { FaCalendarAlt, FaClock, FaPrint } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

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

function Reservations() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  const fetchReservations = useCallback(async () => {
    try {
      const res = await api.get("/reservations");
      setReservations(res.data);
    } catch (error) {
      console.error("Failed to fetch reservations", error);
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

  const getStatusBadge = (status: Reservation["status"]) => {
    switch (status) {
      case "Confirmed":
        return <Badge bg="success">Confirmed</Badge>;
      case "Pending":
        return <Badge bg="warning">Pending</Badge>;
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

  const upcomingReservations = useMemo(
    () =>
      reservations.filter((reservation) =>
        ["Pending", "Confirmed"].includes(reservation.status)
      ),
    [reservations]
  );

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" variant="warning" />
        <p>Loading Reservations...</p>
      </div>
    );
  }

  return (
    <>
      <style>
        {`
          @media print {
            .no-print {
              display: none !important;
            }

            body {
              background: #fff !important;
            }
          }
        `}
      </style>

      <h3 className="mb-4">My Reservations</h3>

      <Row className="mb-4">
        <h5>Upcoming Reservations</h5>
        {upcomingReservations.map((reservation) => (
          <Col md={6} key={reservation.id}>
            <Card className="shadow border-0 rounded-4 mb-3">
              <Card.Body className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-1">Reservation #{reservation.id}</h5>
                  <small className="text-muted d-flex align-items-center gap-1">
                    <FaCalendarAlt /> {new Date(reservation.date).toLocaleDateString()}
                  </small>
                  <small className="text-muted d-flex align-items-center gap-1 mt-1">
                    <FaClock /> {reservation.time}
                  </small>
                  <p className="mb-0 mt-1">{reservation.guests} guests</p>
                  <div className="mt-2">{getStatusBadge(reservation.status)}</div>
                </div>
                <div className="d-flex flex-column gap-2">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => setSelectedReservation(reservation)}
                  >
                    View Details
                  </Button>
                  {reservation.status === "Confirmed" ? (
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => {
                        setSelectedReservation(reservation);
                        setTimeout(() => window.print(), 100);
                      }}
                    >
                      Print Slip
                    </Button>
                  ) : null}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
        {upcomingReservations.length === 0 ? (
          <Col md={12}>
            <p className="text-muted text-center py-3">No upcoming reservations.</p>
          </Col>
        ) : null}
      </Row>

      <Card className="shadow border-0 rounded-4">
        <Card.Body>
          <h5 className="mb-4">Reservation History</h5>
          <Table hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Time</th>
                <th>Guests</th>
                <th>Status</th>
                <th>Response</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td>{reservation.id}</td>
                  <td>{new Date(reservation.date).toLocaleDateString()}</td>
                  <td>{reservation.time}</td>
                  <td>{reservation.guests}</td>
                  <td>{getStatusBadge(reservation.status)}</td>
                  <td style={{ minWidth: 220 }}>
                    {reservation.admin_message ? (
                      <div className="small">{reservation.admin_message}</div>
                    ) : (
                      <span className="text-muted small">Awaiting admin response</span>
                    )}
                    {reservation.status === "Rejected" ? (
                      <div className="text-muted small mt-1">
                        {reservation.alternative_date
                          ? `Suggested date: ${new Date(
                              reservation.alternative_date
                            ).toLocaleDateString()}`
                          : ""}
                        {reservation.alternative_time
                          ? ` | Suggested time: ${reservation.alternative_time}`
                          : ""}
                        {reservation.available_capacity !== null
                          ? ` | Available space: ${reservation.available_capacity}`
                          : ""}
                      </div>
                    ) : null}
                  </td>
                  <td>
                    <div className="d-flex gap-2 flex-wrap">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => setSelectedReservation(reservation)}
                      >
                        View
                      </Button>
                      {reservation.status === "Rejected" ? (
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => navigate("/reservation")}
                        >
                          Reserve Again
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

      <Modal
        show={selectedReservation !== null}
        onHide={() => setSelectedReservation(null)}
        centered
        size="lg"
      >
        <Modal.Header closeButton className="no-print">
          <Modal.Title>
            Reservation #{selectedReservation?.id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReservation ? (
            <Card className="border-0 shadow-sm" id="reservation-slip">
              <Card.Body className="p-4">
                <div className="text-center border-bottom pb-3 mb-4">
                  <img src="/icon.png" alt="Diego Kitchen Restaurant" height="50" className="mb-2" />
                  <h4 className="fw-bold mb-1">Diego Kitchen Restaurant</h4>
                  <small className="text-muted">Reservation Slip</small>
                  <div className="mt-3 d-flex justify-content-center gap-2 flex-wrap">
                    <Badge bg="light" text="dark">
                      Reservation #{selectedReservation.id}
                    </Badge>
                    {getStatusBadge(selectedReservation.status)}
                  </div>
                </div>

                {selectedReservation.status === "Rejected" ? (
                  <Alert variant="danger">
                    This reservation was rejected. Please review the admin response below.
                  </Alert>
                ) : null}

                {selectedReservation.status === "Pending" ? (
                  <Alert variant="warning">
                    Your reservation is still waiting for admin approval.
                  </Alert>
                ) : null}

                <Row className="g-3">
                  <Col md={6}>
                    <small className="text-muted d-block">Guest Name</small>
                    <p className="mb-0">{selectedReservation.name}</p>
                  </Col>
                  <Col md={6}>
                    <small className="text-muted d-block">Email</small>
                    <p className="mb-0">{selectedReservation.email || "N/A"}</p>
                  </Col>
                  <Col md={6}>
                    <small className="text-muted d-block">Phone</small>
                    <p className="mb-0">{selectedReservation.phone || "N/A"}</p>
                  </Col>
                  <Col md={6}>
                    <small className="text-muted d-block">Guests</small>
                    <p className="mb-0">{selectedReservation.guests}</p>
                  </Col>
                  <Col md={6}>
                    <small className="text-muted d-block">Reservation Date</small>
                    <p className="mb-0">
                      {new Date(selectedReservation.date).toLocaleDateString()}
                    </p>
                  </Col>
                  <Col md={6}>
                    <small className="text-muted d-block">Reservation Time</small>
                    <p className="mb-0">{selectedReservation.time}</p>
                  </Col>
                  <Col md={6}>
                    <small className="text-muted d-block">Dining Area</small>
                    <p className="mb-0">{selectedReservation.dining_area || "N/A"}</p>
                  </Col>
                  <Col md={6}>
                    <small className="text-muted d-block">Occasion</small>
                    <p className="mb-0">{selectedReservation.occasion || "General"}</p>
                  </Col>
                  {selectedReservation.special_request ? (
                    <Col xs={12}>
                      <small className="text-muted d-block">Special Request</small>
                      <p className="mb-0">{selectedReservation.special_request}</p>
                    </Col>
                  ) : null}
                  {selectedReservation.admin_message ? (
                    <Col xs={12}>
                      <small className="text-muted d-block">Admin Message</small>
                      <p className="mb-0">{selectedReservation.admin_message}</p>
                    </Col>
                  ) : null}
                  {selectedReservation.status === "Rejected" ? (
                    <Col xs={12}>
                      <small className="text-muted d-block">Suggested Availability</small>
                      <p className="mb-0">
                        {selectedReservation.alternative_date
                          ? new Date(selectedReservation.alternative_date).toLocaleDateString()
                          : "Date not provided"}
                        {" | "}
                        {selectedReservation.alternative_time || "Time not provided"}
                        {" | "}
                        {selectedReservation.available_capacity !== null
                          ? `${selectedReservation.available_capacity} guests available`
                          : "Capacity not provided"}
                      </p>
                    </Col>
                  ) : null}
                </Row>

                <div className="text-center border-top pt-3 mt-4">
                  <small className="text-muted">
                    {selectedReservation.status === "Confirmed"
                      ? "Please present this reservation slip when you arrive."
                      : "Thank you for choosing Diego Kitchen Restaurant."}
                  </small>
                </div>
              </Card.Body>
            </Card>
          ) : null}
        </Modal.Body>
        <Modal.Footer className="no-print">
          {selectedReservation?.status === "Confirmed" ? (
            <Button variant="outline-secondary" onClick={() => window.print()}>
              <FaPrint className="me-1" /> Print Slip
            </Button>
          ) : null}
          {selectedReservation?.status === "Rejected" ? (
            <Button variant="warning" onClick={() => navigate("/reservation")}>
              Reserve Again
            </Button>
          ) : null}
          <Button variant="secondary" onClick={() => setSelectedReservation(null)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Reservations;
