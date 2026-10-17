import { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaClock,
  FaUsers,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaGlassCheers,
} from "react-icons/fa";
import Navigation from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import AuthModal from "../../components/AuthModal/AuthModal";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

function ReservationPage() {
  const { isLoggedIn, user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Form fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    guests: "1 Person",
    date: "",
    time: "",
    occasion: "Family Dinner",
    diningArea: "Indoor",
    specialRequest: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
        email: formData.email || user?.email,
        phone: formData.phone,
        date: formData.date,
        time: formData.time,
        guests: guestsNum,
        dining_area: formData.diningArea,
        occasion: formData.occasion,
        special_request: formData.specialRequest,
      });
      setSubmitting(false);
      setSuccess("Your reservation request has been submitted. The admin will review it and send approval or rejection details by email.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        guests: "1 Person",
        date: "",
        time: "",
        occasion: "Family Dinner",
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
      <Navigation />

      {/* Hero Section */}
      <section
        className="text-white d-flex align-items-center"
        style={{
          background:
            "linear-gradient(rgba(0,0,0,.65), rgba(0,0,0,.65)), url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600') center/cover",
          minHeight: "350px",
          paddingTop: "90px",
        }}
      >
        <Container className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 70 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="display-3 fw-bold">Reserve Your Table</h1>
            <p className="lead mt-3">
              Book your table today and enjoy an unforgettable dining experience.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Reservation */}
      <Container className="py-5">
        <Row className="g-4">
          {/* Left */}
          <Col lg={8}>
            <motion.div
              initial={{ opacity: 0, x: -80 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <Card className="shadow-lg border-0 rounded-4">
                <Card.Body className="p-4">
                  <h2 className="mb-4">Reservation Form</h2>

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

                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder={user?.name || "John Doe"}
                          value={formData.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                        />
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          placeholder={user?.email || "john@email.com"}
                          value={formData.email}
                          onChange={(e) => handleChange("email", e.target.value)}
                        />
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="+1 555-123-4567"
                          value={formData.phone}
                          onChange={(e) => handleChange("phone", e.target.value)}
                        />
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label>Guests</Form.Label>
                        <Form.Select
                          value={formData.guests}
                          onChange={(e) => handleChange("guests", e.target.value)}
                        >
                          <option>1 Person</option>
                          <option>2 Persons</option>
                          <option>3 Persons</option>
                          <option>4 Persons</option>
                          <option>5+ Persons</option>
                        </Form.Select>
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
                        <Form.Label>Occasion</Form.Label>
                        <Form.Select
                          value={formData.occasion}
                          onChange={(e) => handleChange("occasion", e.target.value)}
                        >
                          <option>Family Dinner</option>
                          <option>Birthday</option>
                          <option>Anniversary</option>
                          <option>Business Meeting</option>
                          <option>Wedding</option>
                        </Form.Select>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label>Table Preference</Form.Label>
                        <Form.Select
                          value={formData.diningArea}
                          onChange={(e) => handleChange("diningArea", e.target.value)}
                        >
                          <option>Indoor</option>
                          <option>Outdoor</option>
                          <option>VIP Room</option>
                        </Form.Select>
                      </Col>
                      <Col md={12}>
                        <Form.Label>Special Request</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={4}
                          placeholder="Birthday decoration, window seat, baby chair..."
                          value={formData.specialRequest}
                          onChange={(e) => handleChange("specialRequest", e.target.value)}
                        />
                      </Col>
                    </Row>
                    <Button
                      variant="warning"
                      size="lg"
                      className="mt-4 w-100"
                      type="submit"
                      disabled={submitting}
                    >
                      {submitting ? "Submitting..." : isLoggedIn ? "Reserve Now" : "Sign In to Reserve"}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>

          {/* Right */}
          <Col lg={4}>
            <motion.div
              initial={{ opacity: 0, x: 80 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <Card className="shadow border-0 rounded-4 mb-4">
                <Card.Body>
                  <h4 className="mb-3">Restaurant Hours</h4>
                  <p>
                    <FaClock className="text-warning me-2" />
                    Monday - Thursday
                    <br />
                    10:00 AM - 10:00 PM
                  </p>
                  <p>
                    <FaClock className="text-warning me-2" />
                    Friday - Saturday
                    <br />
                    10:00 AM - 11:30 PM
                  </p>
                  <p>
                    <FaClock className="text-warning me-2" />
                    Sunday
                    <br />
                    11:00 AM - 9:00 PM
                  </p>
                </Card.Body>
              </Card>
              <Card className="shadow border-0 rounded-4">
                <Card.Body>
                  <h4 className="mb-3">Contact Information</h4>
                  <p>
                    <FaPhoneAlt className="text-warning me-2" />
                    +1 (555) 123-4567
                  </p>
                  <p>
                    <FaMapMarkerAlt className="text-warning me-2" />
                    123 Food Street, New York
                  </p>
                  <p>
                    <FaUsers className="text-warning me-2" />
                    Large Groups Welcome
                  </p>
                  <p>
                    <FaCalendarAlt className="text-warning me-2" />
                    Advance Booking Recommended
                  </p>
                  <p>
                    <FaGlassCheers className="text-warning me-2" />
                    Birthday & Anniversary Packages
                  </p>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Container>

      <AuthModal
        show={showAuthModal}
        onHide={() => setShowAuthModal(false)}
        onSuccess={() => setShowAuthModal(false)}
      />

      <Footer />
    </>
  );
}

export default ReservationPage;
