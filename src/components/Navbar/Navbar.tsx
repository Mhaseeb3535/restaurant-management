import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button, Badge } from "react-bootstrap";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import AuthModal from "../AuthModal/AuthModal";
import CartModal from "../CartModal/CartModal";
import NotificationBell from "../Notifications/NotificationBell";
import "./Navbar.css";

function Navigation() {
  const [expanded, setExpanded] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const { items, itemCount } = useCart();
  const isCustomer = user?.role === "customer";

  const handleNav = (path: string) => {
    navigate(path);
    setExpanded(false);
  };

  const handleCheckout = () => {
    if (isLoggedIn) {
      setShowCartModal(false);
      if (items.length > 0) {
        navigate("/customer/checkout");
      }
    } else {
      setShowCartModal(false);
      setShowAuthModal(true);
    }
  };

  const handleUserIconClick = () => {
    if (isLoggedIn) {
      if (user?.role === "admin") navigate("/admin");
      else if (user?.role === "staff") navigate("/staff");
      else if (user?.role === "superadmin") navigate("/super-admin");
      else navigate("/customer");
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <Navbar
        expand="lg"
        fixed="top"
        bg="dark"
        variant="dark"
        expanded={expanded}
        className="shadow-lg py-3"
      >
        <Container>
          <Navbar.Brand onClick={() => handleNav("/")} style={{ cursor: "pointer" }} className="d-flex align-items-center gap-2">
            <img src="/icon.png" alt="Diego Kitchen Restaurant" width="60" height="50"  />
            <div>
              <h3 className="text-warning fw-bold mb-0">
                Diego Kitchen Restaurant
              </h3>
              <small className="text-light d-block" style={{ fontSize: "0.7rem", marginTop: "4px" }}>
              ----------Real food Real flavor----------
              </small>
            </div>
          </Navbar.Brand>

          <Navbar.Toggle onClick={() => setExpanded(!expanded)} />

          <Navbar.Collapse>
            <Nav className="ms-auto align-items-center">
              <Nav.Link onClick={() => handleNav("/")} style={{ cursor: "pointer" }}>Home</Nav.Link>
              <Nav.Link onClick={() => handleNav("/about")} style={{ cursor: "pointer" }}>About</Nav.Link>
              <Nav.Link onClick={() => handleNav("/gallery")} style={{ cursor: "pointer" }}>Gallery</Nav.Link>
              <Nav.Link onClick={() => handleNav("/menu")} style={{ cursor: "pointer" }}>Menu</Nav.Link>
              <Nav.Link onClick={() => handleNav("/reservation")} style={{ cursor: "pointer" }}>
                Reservation
              </Nav.Link>
              <Nav.Link onClick={() => handleNav("/contact")} style={{ cursor: "pointer" }}>
                Contact
              </Nav.Link>

              <div className="nav-quick-actions">
                {isCustomer ? <NotificationBell /> : null}

                <Button
                  variant="warning"
                  className="nav-icon-button nav-cart-button position-relative"
                  onClick={() => setShowCartModal(true)}
                  aria-label="View cart"
                >
                  <FaShoppingCart />
                  {itemCount > 0 && (
                    <Badge
                      bg="danger"
                      className="position-absolute top-0 start-100 translate-middle rounded-pill"
                      style={{ fontSize: "0.65rem" }}
                    >
                      {itemCount}
                    </Badge>
                  )}
                </Button>

                <Button
                  variant="outline-light"
                  className="nav-icon-button"
                  onClick={handleUserIconClick}
                  aria-label="Open account"
                >
                  <FaUser />
                </Button>
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <AuthModal show={showAuthModal} onHide={() => setShowAuthModal(false)} onSuccess={() => {
        setShowAuthModal(false);
        if (items.length > 0) {
          navigate("/customer/checkout");
        }
      }} />
      <CartModal
        show={showCartModal}
        onHide={() => setShowCartModal(false)}
        onCheckout={handleCheckout}
      />
    </>
  );
}

export default Navigation;
