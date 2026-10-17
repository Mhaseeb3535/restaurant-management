import { useState } from "react";
import { startTransition } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Image,
  ListGroup,
  Spinner,
} from "react-bootstrap";
import { FaCreditCard, FaMoneyBillWave, FaUniversity, FaArrowLeft } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

type PaymentMethod = "cod" | "online" | "card";

function Checkout() {
  const navigate = useNavigate();
  const { items, totalPrice, itemCount, clearCart } = useCart();
  const { user } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);

  // Card fields
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const tax = totalPrice * 0.1;
  const grandTotal = totalPrice + tax;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshotFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!deliveryAddress.trim()) {
      setError("Delivery address is required");
      return;
    }

    if (items.length === 0) {
      setError("Your cart is empty");
      return;
    }

    if (paymentMethod === "online" && !screenshotFile) {
      setError("Please upload payment screenshot for online transfer");
      return;
    }

    if (paymentMethod === "card" && (!cardNumber.trim() || !cardExpiry.trim() || !cardCvv.trim() || !cardName.trim())) {
      setError("Please fill in all card details");
      return;
    }

    setSubmitting(true);

    try {
      const orderData = {
        customer_name: user?.name || "Customer",
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        total: grandTotal,
        payment_method: paymentMethod,
        delivery_address: deliveryAddress,
        special_instructions: specialInstructions,
        screenshot: screenshotFile ? screenshotFile.name : "",
      };

      const response = await api.post("/orders", orderData);
      clearCart();
      startTransition(() => {
        navigate("/customer/orders", {
          replace: true,
          state: {
            orderPlaced: true,
            orderId: response.data?.id || null,
          },
        });
      });
      return;
    } catch (err: unknown) {
      const isAxiosErrorWithMessage = (
        error: unknown
      ): error is { response: { data: { error: string } } } => {
        return (
          typeof error === "object" &&
          error !== null &&
          "response" in error &&
          typeof (error as { response?: unknown }).response === "object" &&
          (error as { response: { data?: unknown } }).response !== null &&
          "data" in (error as { response: { data?: unknown } }).response &&
          typeof (error as { response: { data?: unknown } }).response.data === "object" &&
          (error as { response: { data: { error?: unknown } } }).response.data !== null &&
          "error" in (error as { response: { data: { error?: unknown } } }).response.data &&
          typeof (error as { response: { data: { error?: unknown } } }).response.data.error === "string"
        );
      };

      const errorMessage = isAxiosErrorWithMessage(err)
        ? err.response.data.error
        : err instanceof Error
        ? err.message
        : "Failed to place order. Please try again.";

      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <Container className="py-4">
        <Card className="shadow border-0 rounded-4 text-center py-5">
          <Card.Body>
            <h5 className="text-muted">Your cart is empty</h5>
            <p className="text-muted">Add items from the menu before checkout.</p>
            <Button variant="warning" onClick={() => navigate("/menu")}>
              Go to Menu
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Button
        variant="link"
        className="text-decoration-none text-muted mb-3 p-0"
        onClick={() => navigate("/customer/cart")}
      >
        <FaArrowLeft className="me-1" /> Back to Cart
      </Button>

      <h3 className="fw-bold mb-4">Checkout</h3>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Row>
          {/* Order Summary */}
          <Col lg={5} className="order-lg-2 mb-4">
            <Card className="shadow border-0 rounded-4 sticky-top" style={{ top: "100px" }}>
              <Card.Header className="bg-white py-3 rounded-top-4">
                <h5 className="mb-0 fw-bold">Order Summary ({itemCount} items)</h5>
              </Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  {items.map((item) => (
                    <ListGroup.Item key={item.id} className="d-flex align-items-center gap-3 px-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        rounded
                        style={{ width: 50, height: 50, objectFit: "cover" }}
                      />
                      <div className="flex-grow-1">
                        <small className="fw-bold d-block">{item.name}</small>
                        <small className="text-muted">Qty: {item.quantity}</small>
                      </div>
                      <span className="fw-bold">${(item.price * item.quantity).toFixed(2)}</span>
                    </ListGroup.Item>
                  ))}
                </ListGroup>

                <hr />

                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold fs-5">
                  <span>Total</span>
                  <span className="text-warning">${grandTotal.toFixed(2)}</span>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Checkout Form */}
          <Col lg={7} className="order-lg-1">
            <Card className="shadow border-0 rounded-4 mb-4">
              <Card.Body>
                <h5 className="fw-bold mb-3">Delivery Details</h5>

                <Form.Group className="mb-3">
                  <Form.Label>
                    Delivery Address <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Enter your full delivery address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Special Instructions</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Any dietary preferences or special requests..."
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                  />
                </Form.Group>
              </Card.Body>
            </Card>

            <Card className="shadow border-0 rounded-4 mb-4">
              <Card.Body>
                <h5 className="fw-bold mb-3">Payment Method</h5>

                <div className="d-flex gap-2 mb-4 flex-wrap">
                  <Button
                    variant={paymentMethod === "cod" ? "warning" : "outline-secondary"}
                    onClick={() => setPaymentMethod("cod")}
                    className="flex-fill d-flex align-items-center justify-content-center gap-2"
                  >
                    <FaMoneyBillWave /> Cash on Delivery
                  </Button>
                  <Button
                    variant={paymentMethod === "online" ? "warning" : "outline-secondary"}
                    onClick={() => setPaymentMethod("online")}
                    className="flex-fill d-flex align-items-center justify-content-center gap-2"
                  >
                    <FaUniversity /> Online Transfer
                  </Button>
                  <Button
                    variant={paymentMethod === "card" ? "warning" : "outline-secondary"}
                    onClick={() => setPaymentMethod("card")}
                    className="flex-fill d-flex align-items-center justify-content-center gap-2"
                  >
                    <FaCreditCard /> Card Payment
                  </Button>
                </div>

                {paymentMethod === "cod" && (
                  <div className="bg-light p-3 rounded-3">
                    <h6 className="fw-bold text-success">Cash on Delivery</h6>
                    <hr />
                    <p className="mb-1">
                      <strong>Amount to Pay on Delivery:</strong>{" "}
                      <span className="text-warning fw-bold">${grandTotal.toFixed(2)}</span>
                    </p>
                    <p className="mb-0 text-muted">
                      Pay with cash when your order arrives. Please have the exact amount ready.
                    </p>
                    <Alert variant="info" className="mt-2 mb-0 py-2">
                      Estimated delivery time: 30-45 minutes
                    </Alert>
                  </div>
                )}

                {paymentMethod === "online" && (
                  <div className="bg-light p-3 rounded-3">
                    <h6 className="fw-bold text-primary">Bank Transfer Details</h6>
                    <hr />
                    <p className="mb-1">
                      <strong>Bank:</strong> HBL (Habib Bank Limited)
                    </p>
                    <p className="mb-1">
                      <strong>Account Title:</strong> Diego Kitchen Restaurant
                    </p>
                    <p className="mb-1">
                      <strong>Account Number:</strong> 1234-5678-9012-3456
                    </p>
                    <p className="mb-1">
                      <strong>IBAN:</strong> PK36HBLB1234567890123456
                    </p>
                    <p className="mb-1">
                      <strong>Amount to Pay:</strong>{" "}
                      <span className="text-warning fw-bold">${grandTotal.toFixed(2)}</span>
                    </p>
                    <hr />
                    <Form.Group>
                      <Form.Label>
                        Upload Payment Screenshot <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        required={paymentMethod === "online"}
                      />
                      <Form.Text className="text-muted">
                        Please upload a screenshot or photo of your transaction receipt.
                      </Form.Text>
                    </Form.Group>
                    {screenshotFile && (
                      <Alert variant="success" className="mt-2 mb-0 py-2">
                        {screenshotFile.name} uploaded
                      </Alert>
                    )}
                  </div>
                )}

                {paymentMethod === "card" && (
                  <div className="bg-light p-3 rounded-3">
                    <h6 className="fw-bold text-primary">Card Details</h6>
                    <hr />
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Cardholder Name <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="John Doe"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Card Number <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        value={cardNumber}
                        onChange={(e) => {
                          const val = e.target.value
                            .replace(/\D/g, "")
                            .replace(/(.{4})/g, "$1 ")
                            .trim();
                          setCardNumber(val);
                        }}
                        required
                      />
                    </Form.Group>
                    <Row>
                      <Col xs={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            Expiry Date <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="MM/YY"
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => {
                              let val = e.target.value.replace(/\D/g, "");
                              if (val.length >= 2) val = val.slice(0, 2) + "/" + val.slice(2);
                              setCardExpiry(val);
                            }}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col xs={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            CVV <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="password"
                            placeholder="***"
                            maxLength={4}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Alert variant="info" className="py-2 mb-0">
                      Your card details are encrypted and secure.
                    </Alert>
                  </div>
                )}
              </Card.Body>
            </Card>

            <div className="d-flex gap-2 mb-4">
              <Button
                variant="secondary"
                className="flex-fill"
                onClick={() => navigate("/customer/cart")}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                variant="warning"
                type="submit"
                className="flex-fill fw-bold"
                disabled={submitting || items.length === 0}
              >
                {submitting ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Placing Order...
                  </>
                ) : (
                  `Place Order - $${grandTotal.toFixed(2)}`
                )}
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

export default Checkout;
