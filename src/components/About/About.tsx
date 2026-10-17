import { Container, Row, Col, Button } from "react-bootstrap";
import { FaUtensils, FaUsers, FaAward } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import "./About.css";

function About() {
  const navigate = useNavigate();

  return (
    <section className="about-section py-5">
      <Container>

        <Row className="align-items-center">

          {/* Left Side */}
          <Col lg={6} className="mb-4">

            <img
              src="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=900"
              alt="Restaurant"
              className="img-fluid rounded-4 shadow"
            />

          </Col>

          {/* Right Side */}
          <Col lg={6}>

            <span className="text-warning fw-bold">
              ABOUT OUR RESTAURANT
            </span>

            <h2 className="display-5 fw-bold mt-3">
              Welcome To Diego Kitchen Restaurant
            </h2>

            <p className="text-muted mt-4">
              We combine premium ingredients, experienced chefs,
              and elegant dining to create unforgettable memories.
              Every dish is prepared fresh with passion and served
              with excellence.
            </p>

            <Row className="mt-4">

              <Col xs={4} className="text-center">

                <FaUtensils className="about-icon" />

                <h3>150+</h3>

                <p>Dishes</p>

              </Col>

              <Col xs={4} className="text-center">

                <FaUsers className="about-icon" />

                <h3>20K+</h3>

                <p>Customers</p>

              </Col>

              <Col xs={4} className="text-center">

                <FaAward className="about-icon" />

                <h3>15</h3>

                <p>Awards</p>

              </Col>

            </Row>

            <Button
              variant="warning"
              className="mt-4 px-4 py-2"
              onClick={() => navigate("/about")}
            >
              Read More
            </Button>

          </Col>

        </Row>

      </Container>
    </section>
  );
}

export default About;
