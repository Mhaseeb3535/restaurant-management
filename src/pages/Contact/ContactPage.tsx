import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Accordion,
  Alert,
  Spinner,
} from "react-bootstrap";

import { motion } from "framer-motion";
import { AxiosError } from "axios";

import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";
import api from "../../services/api";
import Navigation from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "./ContactPage.css";
function ContactPage() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const response = await api.post("/contact", formData);
      if (response.data.success) {
        setSuccess("Your message has been sent successfully! We'll get back to you soon.");
        setFormData({ full_name: "", email: "", phone: "", subject: "", message: "" });
      }
    } catch (err) {
      const axiosError = err as AxiosError<{ error: string }>;
      setError(axiosError.response?.data?.error || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navigation />

      {/* Hero */}

      <section className="contact-hero">

        <Container>

          <motion.div
            initial={{ opacity: 0, y: 70 }}
            whileInView={{ opacity: 1, y: 0 }}
          >

            <h1 className="display-3 fw-bold">Contact Us</h1>

            <div className="hero-divider"></div>

            <p className="lead">We'd love to hear from you.</p>

          </motion.div>

        </Container>

      </section>

      <Container className="py-5">

        <Row>

          {/* Contact Form */}

          <Col lg={8}>

            <Card className="shadow border-0 rounded-4">

              <Card.Body>

                <h3 className="mb-4">

                  Send Us a Message

                </h3>

                {success && <Alert variant="success">{success}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>

                  <Row>

                    <Col md={6}>

                      <Form.Group className="mb-3">

                        <Form.Label>

                          Full Name

                        </Form.Label>

                        <Form.Control
                          name="full_name"
                          value={formData.full_name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          required
                        />

                      </Form.Group>

                    </Col>

                    <Col md={6}>

                      <Form.Group className="mb-3">

                        <Form.Label>

                          Email

                        </Form.Label>

                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@email.com"
                          required
                        />

                      </Form.Group>

                    </Col>

                    <Col md={6}>

                      <Form.Group className="mb-3">

                        <Form.Label>

                          Phone

                        </Form.Label>

                        <Form.Control
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+1 555-123-4567"
                        />

                      </Form.Group>

                    </Col>

                    <Col md={6}>

                      <Form.Group className="mb-3">

                        <Form.Label>

                          Subject

                        </Form.Label>

                        <Form.Control
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="Reservation"
                        />

                      </Form.Group>

                    </Col>

                    <Col md={12}>

                      <Form.Group>

                        <Form.Label>

                          Message

                        </Form.Label>

                        <Form.Control
                          as="textarea"
                          rows={5}
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Write your message..."
                          required
                        />

                      </Form.Group>

                    </Col>

                  </Row>

                  <Button
                    className="mt-4"
                    variant="warning"
                    size="lg"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" animation="border" className="me-2" />
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}

                  </Button>

                </Form>

              </Card.Body>

            </Card>

          </Col>

          {/* Right Side */}

          <Col lg={4}>

            <Card className="shadow border-0 rounded-4 mb-4">

              <Card.Body>

                <h4>

                  Contact Information

                </h4>

                <hr />

                <p>

                  <FaPhoneAlt className="text-warning me-2" />

                  +1 (555) 123-4567

                </p>

                <p>

                  <FaEnvelope className="text-warning me-2" />

                  info@royaldining.com

                </p>

                <p>

                  <FaMapMarkerAlt className="text-warning me-2" />

                  123 Food Street

                  <br />

                  New York

                </p>

              </Card.Body>

            </Card>

            <Card className="shadow border-0 rounded-4">

              <Card.Body>

                <h4>

                  Opening Hours

                </h4>

                <hr />

                <p>

                  <FaClock className="text-warning me-2"/>

                  Monday - Thursday

                  <br />

                  10 AM - 10 PM

                </p>

                <p>

                  Friday - Saturday

                  <br />

                  10 AM - 11:30 PM

                </p>

                <p>

                  Sunday

                  <br />

                  11 AM - 9 PM

                </p>

              </Card.Body>

            </Card>

          </Col>

        </Row>

      </Container>

      {/* Google Map */}

      <section className="py-5 bg-light">

        <Container>

          <h2 className="text-center mb-4">

            Find Us

          </h2>

          <div
            className="rounded-4 shadow"
            style={{
              height: "400px",
              background: "#ddd",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "25px",
              fontWeight: "bold",
            }}
          >

            Google Map Here

          </div>

        </Container>

      </section>

      {/* FAQ */}

      <Container className="py-5">

        <h2 className="text-center mb-5">

          Frequently Asked Questions

        </h2>

        <Accordion>

          <Accordion.Item eventKey="0">

            <Accordion.Header>

              Do I need a reservation?

            </Accordion.Header>

            <Accordion.Body>

              Reservations are recommended, especially on weekends and holidays.

            </Accordion.Body>

          </Accordion.Item>

          <Accordion.Item eventKey="1">

            <Accordion.Header>

              Do you offer home delivery?

            </Accordion.Header>

            <Accordion.Body>

              Yes, online ordering and delivery are available.

            </Accordion.Body>

          </Accordion.Item>

          <Accordion.Item eventKey="2">

            <Accordion.Header>

              Can I host private events?

            </Accordion.Header>

            <Accordion.Body>

              Yes. Birthdays, anniversaries and corporate events are welcome.

            </Accordion.Body>

          </Accordion.Item>

        </Accordion>

      </Container>

      {/* Social */}

      <section className="bg-warning py-5">

        <Container className="text-center">

          <h2>

            Follow Us

          </h2>

          <div className="mt-4">

            <Button
              variant="dark"
              className="m-2"
            >

              <FaFacebook />

            </Button>

            <Button
              variant="dark"
              className="m-2"
            >

              <FaInstagram />

            </Button>

            <Button
              variant="dark"
              className="m-2"
            >

              <FaWhatsapp />

            </Button>

          </div>

        </Container>

      </section>

      <Footer />
    </>
  );
}

export default ContactPage;
