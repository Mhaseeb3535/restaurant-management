import { Container, Row, Col } from "react-bootstrap";
import { FaFacebook, FaInstagram, FaTwitter, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer-section">
      <Container>
        <Row>
          <Col lg={4} className="mb-4">
            <h3 className="text-warning">Diego Kitchen Restaurant</h3>
            <p>
              <strong>Real food Real flavor.</strong> Enjoy premium dining with fresh ingredients, expert chefs,
              and exceptional service.
            </p>
          </Col>

          <Col lg={4} className="mb-4">
            <h5>Contact</h5>
            <p><FaMapMarkerAlt /> Main Street, Your City</p>
            <p><FaPhone /> +92 300 1234567</p>
<p><FaEnvelope /> info@diegokitchen.com</p>
          </Col>

          <Col lg={4} className="mb-4">
            <h5>Follow Us</h5>
            <div className="social-icons">
              <FaFacebook />
              <FaInstagram />
              <FaTwitter />
            </div>
          </Col>
        </Row>

        <hr />

        <p className="text-center mb-0">
          © 2026 Diego Kitchen Restaurant. All Rights Reserved.
        </p>
      </Container>
    </footer>
  );
}

export default Footer;