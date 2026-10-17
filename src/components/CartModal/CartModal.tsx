import { Modal, Button, Row, Col } from "react-bootstrap";
import { FaShoppingCart, FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import "./CartModal.css";

interface CartModalProps {
  show: boolean;
  onHide: () => void;
  onCheckout?: () => void;
}

function CartModal({ show, onHide, onCheckout }: CartModalProps) {
  const { items, itemCount, totalPrice, removeFromCart, updateQuantity, clearCart } = useCart();

  const handleCheckout = () => {
    onHide();
    if (onCheckout) {
      onCheckout();
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="cart-modal">
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold d-flex align-items-center gap-2">
          <FaShoppingCart className="text-warning" />
          Your Cart ({itemCount} {itemCount === 1 ? "item" : "items"})
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {items.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">
              <FaShoppingCart />
            </div>
            <h5>Your cart is empty</h5>
            <p className="text-muted">Add some delicious items from our menu!</p>
          </div>
        ) : (
          <>
            {items.map((item) => (
              <div key={item.id} className="cart-item-card">
                <Row className="align-items-center g-2">
                  <Col xs={3} sm={2}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="cart-item-image w-100"
                    />
                  </Col>
                  <Col xs={9} sm={4}>
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-price">${item.price.toFixed(2)}</div>
                  </Col>
                  <Col xs={6} sm={3} className="mt-2 mt-sm-0">
                    <div className="quantity-control">
                      <button
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <FaMinus size={10} />
                      </button>
                      <span className="quantity-value">{item.quantity}</span>
                      <button
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <FaPlus size={10} />
                      </button>
                    </div>
                  </Col>
                  <Col xs={4} sm={2} className="text-end mt-2 mt-sm-0">
                    <span className="line-total">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </Col>
                  <Col xs={2} sm={1} className="text-end mt-2 mt-sm-0">
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(item.id)}
                      title="Remove item"
                    >
                      <FaTrash size={14} />
                    </button>
                  </Col>
                </Row>
              </div>
            ))}

            <div className="cart-summary d-flex justify-content-between align-items-center">
              <div>
                <strong>Total:</strong>
                <span className="text-warning fs-5 fw-bold ms-2">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={clearCart}
              >
                Clear Cart
              </Button>
            </div>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Continue Shopping
        </Button>
        {items.length > 0 && (
          <Button
            variant="warning"
            onClick={handleCheckout}
          >
            Proceed to Checkout — ${totalPrice.toFixed(2)}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default CartModal;
