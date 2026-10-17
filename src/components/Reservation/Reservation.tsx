import { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import AuthModal from "../AuthModal/AuthModal";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import "./Reservation.css";

function Reservation() {
  const { isLoggedIn, user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    guests: "1 Person",
    diningArea: "Indoor",
    specialRequest: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleReserve = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }

    if (!formData.date || !formData.time) {
      setError("Please select date and time.");
      return;
    }

    setSubmitting(true);
    try {
      const guestsNum = parseInt(formData.guests) || 1;
      await api.post("/reservations", {
        user_id: user?.id,
        name: formData.name || user?.name,
        email: user?.email,
        phone: formData.phone,
        date: formData.date,
        time: formData.time,
        guests: guestsNum,
        dining_area: formData.diningArea,
        special_request: formData.specialRequest,
      });
      setSubmitting(false);
      setSuccess("Your table has been reserved successfully!");
      setFormData({
        name: "",
        phone: "",
        date: "",
        time: "",
        guests: "1 Person",
        diningArea: "Indoor",
        specialRequest: "",
      });
    } catch (err) {
      setSubmitting(false);
      const errorObj = err as { response?: { data?: { error?: string } } };
      setError(errorObj.response?.data?.error || "Failed to make reservation. Please try again.");
    }
  };

  return (
    <>
      <section className="reservation-section py-5">
        <Container>
          <div className="text-center mb-5">
            <span className="text-warning fw-bold">BOOK YOUR TABLE</span>
            <h2 className="display-5 fw-bold">Reserve Your Dining Experience</h2>
            <p className="text-muted">Book your favorite table in advance.</p>
          </div>

          <Row className="justify-content-center">
            <Col lg={8}>
              <div className="reservation-card shadow">
                {!isLoggedIn && (
                  <Alert variant="info" className="d-flex justify-content-between align-items-center">
                    <span>Please sign in to make a reservation.</span>
                    <Button variant="warning" size="sm" onClick={() => setShowAuthModal(true)}>
                      Sign In
                    </Button>
                  </Alert>
                )}

                {success && <Alert variant="success">{success}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleReserve}>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder={user?.name || "Enter your name"}
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                      />
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="03XXXXXXXXX"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                      />
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Label>Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleChange("date", e.target.value)}
                        required
                      />
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Label>Time</Form.Label>
                      <Form.Control
                        type="time"
                        value={formData.time}
                        onChange={(e) => handleChange("time", e.target.value)}
                        required
                      />
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Label>Guests</Form.Label>
                      <Form.Select
                        value={formData.guests}
                        onChange={(e) => handleChange("guests", e.target.value)}
                        required
                      >
                        <option value="">Select guests</option>
                        <option>1 Person</option>
                        <option>2 People</option>
                        <option>4 People</option>
                        <option>6 People</option>
                        <option>8+ People</option>
                      </Form.Select>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Label>Dining Area</Form.Label>
                      <Form.Select
                        value={formData.diningArea}
                        onChange={(e) => handleChange("diningArea", e.target.value)}
                        required
                      >
                        <option value="">Select area</option>
                        <option>Indoor</option>
                        <option>Outdoor</option>
                        <option>VIP Lounge</option>
                      </Form.Select>
                    </Col>
                    <Col xs={12} className="mb-3">
                      <Form.Label>Special Request</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        placeholder="Birthday, Anniversary, etc."
                        value={formData.specialRequest}
                        onChange={(e) => handleChange("specialRequest", e.target.value)}
                      />
                    </Col>
                    <Col xs={12}>
                      <Button
                        variant="warning"
                        size="lg"
                        className="w-100"
                        type="submit"
                        disabled={submitting}
                      >
                        {submitting ? "Submitting..." : isLoggedIn ? "Reserve Now" : "Sign In to Reserve"}
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <AuthModal
        show={showAuthModal}
        onHide={() => setShowAuthModal(false)}
        onSuccess={() => setShowAuthModal(false)}
      />
    </>
  );
}

export default Reservation;
