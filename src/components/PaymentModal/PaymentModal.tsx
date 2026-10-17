import { useState } from "react";
import { Modal, Button, Form, Row, Col, Alert } from "react-bootstrap";
import api from "../../services/api";

export interface FoodItem {
  id: number;
  name: string;
  price: number;
  image?: string;
}

type PaymentMethod = "online" | "card" | "cod";

export interface PaymentOrder {
  id: number;
  items: string;
  total: number;
  date: string;
  status: "Pending";
  paymentMethod: PaymentMethod;
  deliveryAddress: string;
  specialInstructions: string;
  screenshot: string | null;
}

interface PaymentModalProps {
  show: boolean;
  onHide: () => void;
  item: FoodItem | null;
  onOrderPlaced: (order: PaymentOrder) => void;
}

function PaymentModal({ show, onHide, item, onOrderPlaced }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("online");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");

  const total = item ? item.price * quantity : 0;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshotFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryAddress.trim() || !item) return;

    let screenshotUrl = null;
    if (screenshotFile) {
      const formData = new FormData();
      formData.append("file", screenshotFile);
      try {
        const res = await api.post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        screenshotUrl = res.data.url;
      } catch (error) {
        console.error("Error uploading screenshot:", error);
        return;
      }
    }

    const currentDate = new Date();
    const orderData = {
      id: currentDate.getTime(),
      items: `${item.name} x${quantity}`,
      total,
      date: currentDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      status: "Pending" as const,
      paymentMethod,
      deliveryAddress,
      specialInstructions,
      screenshot: screenshotUrl,
    };

    onOrderPlaced(orderData);
    setSubmitted(true);

    setTimeout(() => {
      resetForm();
      onHide();
    }, 3000);
  };

  const resetForm = () => {
    setPaymentMethod("online");
    setDeliveryAddress("");
    setQuantity(1);
    setSpecialInstructions("");
    setScreenshotFile(null);
    setCardNumber("");
    setCardExpiry("");
    setCardCvv("");
    setCardName("");
    setSubmitted(false);
  };

  const handleClose = () => {
    resetForm();
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">
          {submitted ? "Order Placed!" : "Complete Your Order"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {submitted ? (
          <Alert variant="success" className="text-center py-4">
            <h4 className="fw-bold">Order Placed Successfully!</h4>
            <p className="mb-0">Your order has been placed. You can track it in your orders page.</p>
          </Alert>
        ) : item ? (
          <Form onSubmit={handleSubmit}>
            <div className="bg-light p-3 rounded-3 mb-4">
              <Row className="align-items-center">
                <Col xs={3}>
                  <img src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100"} alt={item.name} className="img-fluid rounded" style={{ height: 80, objectFit: "cover" }} />
                </Col>
                <Col xs={5}>
                  <h6 className="fw-bold mb-1">{item.name}</h6>
                  <span className="text-muted">${item.price.toFixed(2)} each</span>
                </Col>
                <Col xs={2}>
                  <div className="d-flex align-items-center gap-2">
                    <Button variant="outline-secondary" size="sm" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</Button>
                    <span className="fw-bold">{quantity}</span>
                    <Button variant="outline-secondary" size="sm" onClick={() => setQuantity(quantity + 1)}>+</Button>
                  </div>
                </Col>
                <Col xs={2} className="text-end">
                  <h6 className="fw-bold text-warning mb-0">${total.toFixed(2)}</h6>
                </Col>
              </Row>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Special Instructions</Form.Label>
              <Form.Control as="textarea" rows={2} placeholder="Any dietary preferences or special requests..." value={specialInstructions} onChange={(e) => setSpecialInstructions(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Delivery Address <span className="text-danger">*</span></Form.Label>
              <Form.Control as="textarea" rows={2} placeholder="Enter your full delivery address" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} required />
            </Form.Group>

            <h6 className="fw-bold mb-3">Select Payment Method</h6>
            <div className="d-flex gap-2 mb-4 flex-wrap">
              <Button variant={paymentMethod === "online" ? "warning" : "outline-secondary"} onClick={() => setPaymentMethod("online")} className="flex-fill">Online Transfer</Button>
              <Button variant={paymentMethod === "card" ? "warning" : "outline-secondary"} onClick={() => setPaymentMethod("card")} className="flex-fill">Card Payment</Button>
              <Button variant={paymentMethod === "cod" ? "warning" : "outline-secondary"} onClick={() => setPaymentMethod("cod")} className="flex-fill">Cash on Delivery</Button>
            </div>

            {paymentMethod === "online" && (
              <div className="bg-light p-3 rounded-3 mb-3">
                <h6 className="fw-bold text-primary">Bank Transfer Details</h6>
                <hr />
                <p className="mb-1"><strong>Bank:</strong> HBL (Habib Bank Limited)</p>
                <p className="mb-1"><strong>Account Title:</strong> Diego Kitchen Restaurant</p>
                <p className="mb-1"><strong>Account Number:</strong> 1234-5678-9012-3456</p>
                <p className="mb-1"><strong>IBAN:</strong> PK36HBLB1234567890123456</p>
                <p className="mb-1"><strong>Amount to Pay:</strong> <span className="text-warning fw-bold">${total.toFixed(2)}</span></p>
                <hr />
                <Form.Group>
                  <Form.Label>Upload Payment Screenshot <span className="text-danger">*</span></Form.Label>
                  <Form.Control type="file" accept="image/*" onChange={handleFileChange} required />
                  <Form.Text className="text-muted">Please upload a screenshot or photo of your transaction receipt.</Form.Text>
                </Form.Group>
                {screenshotFile && <Alert variant="success" className="mt-2 mb-0 py-2">{screenshotFile.name} uploaded</Alert>}
              </div>
            )}

            {paymentMethod === "card" && (
              <div className="bg-light p-3 rounded-3 mb-3">
                <h6 className="fw-bold text-primary">Card Details</h6>
                <hr />
                <Form.Group className="mb-3">
                  <Form.Label>Cardholder Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control type="text" placeholder="John Doe" value={cardName} onChange={(e) => setCardName(e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Card Number <span className="text-danger">*</span></Form.Label>
                  <Form.Control type="text" placeholder="1234 5678 9012 3456" maxLength={19} value={cardNumber} onChange={(e) => { const val = e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim(); setCardNumber(val); }} required />
                </Form.Group>
                <Row>
                  <Col xs={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Expiry Date <span className="text-danger">*</span></Form.Label>
                      <Form.Control type="text" placeholder="MM/YY" maxLength={5} value={cardExpiry} onChange={(e) => { let val = e.target.value.replace(/\D/g, ""); if (val.length >= 2) val = val.slice(0, 2) + "/" + val.slice(2); setCardExpiry(val); }} required />
                    </Form.Group>
                  </Col>
                  <Col xs={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>CVV <span className="text-danger">*</span></Form.Label>
                      <Form.Control type="password" placeholder="***" maxLength={4} value={cardCvv} onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))} required />
                    </Form.Group>
                  </Col>
                </Row>
                <Alert variant="info" className="py-2 mb-0">Your card details are encrypted and secure.</Alert>
              </div>
            )}

            {paymentMethod === "cod" && (
              <div className="bg-light p-3 rounded-3 mb-3">
                <h6 className="fw-bold text-success">Cash on Delivery</h6>
                <hr />
                <p className="mb-1"><strong>Amount to Pay on Delivery:</strong> <span className="text-warning fw-bold">${total.toFixed(2)}</span></p>
                <p className="mb-0 text-muted">Pay with cash when your order arrives at your delivery address. Please have the exact amount ready.</p>
                <Alert variant="warning" className="mt-2 mb-0 py-2">Estimated delivery time: 30-45 minutes</Alert>
              </div>
            )}

            <div className="d-flex gap-2 mt-4">
              <Button variant="secondary" className="flex-fill" onClick={handleClose}>Cancel</Button>
              <Button variant="warning" type="submit" className="flex-fill fw-bold" disabled={!deliveryAddress.trim()}>Place Order - ${total.toFixed(2)}</Button>
            </div>
          </Form>
        ) : (
          <Alert variant="warning">No item selected. Please select an item to order.</Alert>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default PaymentModal;
