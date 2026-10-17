import { Button, Card, Col, Image, ListGroup, Row } from "react-bootstrap";
import { FaShoppingCart, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import PageTitle from "../../components/Common/PageTitle";

function Cart() {
  const navigate = useNavigate();
  const { items, itemCount, totalPrice, removeFromCart, updateQuantity } = useCart();

  return (
    <>
      <PageTitle title="Shopping Cart" />

      {items.length === 0 ? (
        <Card className="shadow border-0 rounded-4 text-center py-5">
          <Card.Body>
            <FaShoppingCart size={50} className="text-muted mb-3" />
            <h5 className="text-muted">Your cart is empty</h5>
            <p className="text-muted">
              Browse the menu and add items to your cart!
            </p>
            <Button variant="primary" href="/menu">
              Go to Menu
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          <Col lg={8}>
            <Card className="shadow border-0 rounded-4">
              <Card.Header className="bg-white py-3">
                <h5 className="mb-0">Cart Items ({itemCount})</h5>
              </Card.Header>
              <ListGroup variant="flush">
                {items.map((item) => (
                  <ListGroup.Item key={item.id} className="py-3">
                    <Row className="align-items-center">
                      <Col xs="auto">
                        <Image
                          src={item.image}
                          rounded
                          style={{ width: 80, height: 80, objectFit: "cover" }}
                        />
                      </Col>
                      <Col>
                        <h6>{item.name}</h6>
                        <p className="text-muted mb-1">${item.price.toFixed(2)}</p>
                      </Col>
                      <Col
                        xs="auto"
                        className="d-flex align-items-center justify-content-center"
                      >
                        <Button
                          size="sm"
                          variant="outline-secondary"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="me-2"
                        >
                          -
                        </Button>
                        <span>{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline-secondary"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="ms-2"
                        >
                          +
                        </Button>
                      </Col>
                      <Col xs="auto">
                        <p className="mb-0 fw-bold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </Col>
                      <Col xs="auto">
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <FaTrash />
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="shadow border-0 rounded-4">
              <Card.Header className="bg-white py-3">
                <h5 className="mb-0">Order Summary</h5>
              </Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item className="d-flex justify-content-between">
                    <span>Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between">
                    <span>Tax (10%)</span>
                    <span>${(totalPrice * 0.1).toFixed(2)}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between fw-bold">
                    <span>Total</span>
                    <span>${(totalPrice * 1.1).toFixed(2)}</span>
                  </ListGroup.Item>
                </ListGroup>
                <div className="d-grid mt-3">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => navigate("/customer/checkout")}
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
}

export default Cart;


