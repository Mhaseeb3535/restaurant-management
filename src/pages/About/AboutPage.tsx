import React, { useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import {
  FaUtensils,
  FaAward,
  FaSmile,
  FaLeaf,
  FaClock,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navigation from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const NavigationComponent = Navigation as unknown as React.ComponentType<Record<string, unknown>>;

import "./AboutPage.css";

function AboutPage() {
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);

  const features = [
    {
      icon: <FaLeaf size={40} />,
      title: "Fresh Ingredients",
      desc: "Every dish is prepared using fresh and premium quality ingredients.",
    },
    {
      icon: <FaAward size={40} />,
      title: "Award Winning Chefs",
      desc: "Our experienced chefs create unforgettable dining experiences.",
    },
    {
      icon: <FaClock size={40} />,
      title: "Fast Service",
      desc: "Quick preparation without compromising taste or quality.",
    },
  ];

  const stats = [
    {
      number: "15+",
      title: "Years Experience",
    },
    {
      number: "50+",
      title: "Professional Staff",
    },
    {
      number: "120+",
      title: "Delicious Dishes",
    },
    {
      number: "5000+",
      title: "Happy Customers",
    },
  ];

  return (
    <>
      <NavigationComponent />

      {/* Hero */}
      <section className="about-hero">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="display-3 fw-bold">About Royal Dining</h1>
            <div className="hero-divider"></div>
            <p className="lead mt-3">
              Serving unforgettable flavors with exceptional hospitality since 2012.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Story */}

      <Container className="py-5">

        <Row className="align-items-center">

          <Col lg={6}>

            <motion.img
              initial={{ opacity: 0, x: -80 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: .8 }}
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"
              className="img-fluid rounded-4 shadow"
            />

          </Col>

          <Col lg={6}>

            <motion.div
              initial={{ opacity: 0, x: 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: .8 }}
            >

              <h2 className="fw-bold">

                Our Story

              </h2>

              <p className="text-muted mt-3">

                Royal Dining Restaurant has become one of the city's favorite
                destinations for delicious food and memorable dining
                experiences.

              </p>

              <p className="text-muted">

                Combining authentic recipes with modern presentation, our chefs
                prepare every meal with passion and perfection.

              </p>

              <Button
                variant="warning"
                onClick={() => setShowMore(!showMore)}
              >

                {showMore ? "Show Less" : "Learn More"}

              </Button>

              <AnimatePresence>
                {showMore && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    <p className="text-muted mt-3">
                      Founded in 2012, Royal Dining Restaurant was born from a
                      passion for bringing people together through exceptional
                      food. What started as a small family-owned establishment
                      has grown into one of the city's most beloved dining
                      destinations.
                    </p>
                    <p className="text-muted">
                      Our philosophy is simple — use the freshest ingredients,
                      honor traditional recipes, and innovate with modern
                      techniques. Every dish that leaves our kitchen tells a
                      story of dedication, quality, and love for the culinary
                      arts.
                    </p>
                    <p className="text-muted">
                      We believe that dining is more than just eating — it's an
                      experience. From the warm ambiance to the impeccable
                      service, every detail is crafted to make your time with us
                      truly unforgettable.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>

          </Col>

        </Row>

      </Container>

      {/* Why Choose Us */}

      <section className="py-5 bg-light">

        <Container>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >

            <h2 className="text-center fw-bold mb-5">

              Why Choose Us

            </h2>

          </motion.div>

          <Row>

            {features.map((item, index) => (

              <Col lg={4} key={index}>

                <motion.div
                  whileHover={{ y: -10 }}
                >

                  <Card className="shadow border-0 rounded-4 text-center p-4 h-100">

                    <div className="text-warning mb-3">

                      {item.icon}

                    </div>

                    <h4>

                      {item.title}

                    </h4>

                    <p className="text-muted">

                      {item.desc}

                    </p>

                  </Card>

                </motion.div>

              </Col>

            ))}

          </Row>

        </Container>

      </section>

      {/* Statistics */}

      <Container className="py-5">

        <Row>

          {stats.map((item, index) => (

            <Col md={3} key={index}>

              <Card className="text-center shadow border-0 rounded-4 p-4">

                <h1 className="display-5 text-warning">

                  {item.number}

                </h1>

                <h5>

                  {item.title}

                </h5>

              </Card>

            </Col>

          ))}

        </Row>

      </Container>

      {/* Meet Our Team */}

      <section className="py-5 bg-light">

        <Container>

          <h2 className="text-center fw-bold mb-5">

            Meet Our Chefs

          </h2>

          <Row>

            {["Head Chef", "Sous Chef", "Pastry Chef"].map((chef, index) => (

              <Col lg={4} key={index}>

                <Card className="border-0 shadow rounded-4">

                  <Card.Img
                    variant="top"
                    src={`https://picsum.photos/400/40${index + 1}`}
                  />

                  <Card.Body className="text-center">

                    <h4>{chef}</h4>

                    <p className="text-muted">

                      Passionate culinary expert dedicated to creating
                      unforgettable flavors.

                    </p>

                  </Card.Body>

                </Card>

              </Col>

            ))}

          </Row>

        </Container>

      </section>

      {/* Reviews */}

      <Container className="py-5">

        <h2 className="text-center fw-bold mb-5">

          Customer Reviews

        </h2>

        <Row>

          {[
            "Amazing food and wonderful staff!",
            "Best restaurant in town.",
            "Highly recommended for family dinners.",
          ].map((review, index) => (

            <Col lg={4} key={index}>

              <Card className="shadow border-0 rounded-4 p-4 h-100">

                <FaSmile
                  size={40}
                  className="text-warning mb-3"
                />

                <p>

                  "{review}"

                </p>

                <h6 className="mt-3">

                  ⭐⭐⭐⭐⭐

                </h6>

              </Card>

            </Col>

          ))}

        </Row>

      </Container>

      {/* CTA */}

      <section className="bg-warning py-5">

        <Container className="text-center">

          <FaUtensils size={50} />

          <h2 className="fw-bold mt-3">

            Experience Fine Dining Today

          </h2>

          <p>

            Reserve your table now and enjoy an unforgettable dining experience.

          </p>

          <Button
            variant="dark"
            size="lg"
            onClick={() => navigate("/reservation")}
          >

            Book A Table

          </Button>

        </Container>

      </section>

      <Footer />
    </>
  );
}

export default AboutPage;
