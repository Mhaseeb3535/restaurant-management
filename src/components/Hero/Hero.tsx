import { useState } from "react";
import { Button, Container } from "react-bootstrap";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AuthModal from "../AuthModal/AuthModal";

import "./Hero.css";

function Hero() {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <section className="hero-section">
        <div className="hero-overlay">
          <Container className="hero-content">
            <h1>
              Diego Kitchen Restaurant
            </h1>

            <h2 className="text-warning mb-3" style={{ fontSize: "1.8rem", fontWeight: 300, letterSpacing: "2px" }}>
              Real food Real flavor
            </h2>

            <p>
              Fresh ingredients, world-class chefs, unforgettable taste.
              Reserve your table or order your favorite meals online.
            </p>

            <div className="hero-buttons">
              <Button variant="warning" size="lg" onClick={() => navigate("/reservation") }>
                Reserve Table
              </Button>

              <Button variant="outline-light" size="lg" onClick={() => navigate("/menu")}>
                Explore Menu <FaArrowRight className="ms-2" />
              </Button>
            </div>
          </Container>
        </div>
      </section>

      <AuthModal show={showAuthModal} onHide={() => setShowAuthModal(false)} />
    </>
  );
}

export default Hero;
