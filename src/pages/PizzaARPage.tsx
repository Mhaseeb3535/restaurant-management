import { useMemo, useState } from "react";
import { Alert, Button, Card, Col, Container, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import PizzaARViewer from "../components/PizzaARViewer";
import PizzaSizeSelector from "../components/PizzaSizeSelector";
import { useCart } from "../context/CartContext";
import { getPizzaSizeOption, getPizzaSizeOptionsForPizza } from "../types/pizza";

interface PizzaMenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  rating?: number;
  available?: boolean;
  special?: boolean;
}

function PizzaARPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const pizza = (location.state as { food?: PizzaMenuItem } | null)?.food;
  const defaultSize = useMemo(
    () => getPizzaSizeOption(12),
    [],
  );

  const [selectedSize, setSelectedSize] = useState(defaultSize);

  if (!pizza) {
    return (
      <Container className="py-5">
        <Alert variant="warning">No pizza was selected for AR preview.</Alert>
        <Button variant="warning" onClick={() => navigate("/menu")}>
          Back to menu
        </Button>
      </Container>
    );
  }

  const sizeOptions = getPizzaSizeOptionsForPizza(pizza.name, pizza.category);
  const selectedOption =
    sizeOptions.find((option) => option.inches === selectedSize.inches) ?? sizeOptions[0];

  const handleSelectSize = (size: (typeof sizeOptions)[number]) => {
    setSelectedSize(size);
  };

  const handleAddToCart = () => {
    addToCart({
      id: pizza.id,
      name: `${pizza.name} (${selectedOption.inches}")`,
      price: pizza.price,
      image: pizza.image,
      size: selectedOption.inches,
      variantLabel: `${selectedOption.inches}" pizza`,
    });
    navigate("/menu");
  };

  return (
    <Container className="py-5">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
        <div>
          <p className="text-warning fw-semibold mb-1">AR pizza size visualizer</p>
          <h1 className="fw-bold mb-0">{pizza.name}</h1>
        </div>
        <Button variant="outline-secondary" onClick={() => navigate("/menu")}>
          Return to menu
        </Button>
      </div>

      <Row className="g-4 align-items-start">
        <Col lg={5}>
          <Card className="border-0 shadow rounded-4 overflow-hidden">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                <img
                  src={pizza.image}
                  alt={pizza.name}
                  style={{ width: 90, height: 90, objectFit: "cover", borderRadius: 16 }}
                />
                <div>
                  <h5 className="mb-1 fw-bold">{pizza.name}</h5>
                  <p className="text-muted mb-0">{pizza.category}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-muted mb-2">Choose a size</p>
                <PizzaSizeSelector
                  options={sizeOptions}
                  selectedSize={selectedOption}
                  onChange={handleSelectSize}
                />
              </div>

              <div className="rounded-4 bg-light p-3 mb-4">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted">Diameter</span>
                  <strong>
                    {selectedOption.inches}" / {selectedOption.cm.toFixed(2)} cm
                  </strong>
                </div>
                <div className="d-flex justify-content-between align-items-center mt-2">
                  <span className="text-muted">Scale</span>
                  <strong>{selectedOption.scaleFactor.toFixed(2)}x</strong>
                </div>
                <div className="d-flex justify-content-between align-items-center mt-2">
                  <span className="text-muted">Actual size</span>
                  <strong>{selectedOption.metres.toFixed(4)} m</strong>
                </div>
              </div>

              <div className="d-flex flex-wrap gap-2">
                <Button variant="warning" onClick={handleAddToCart}>
                  Add selected size to cart
                </Button>
                <Button variant="outline-secondary" onClick={() => navigate("/menu")}>
                  Back to menu
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={7}>
          <PizzaARViewer
            productName={pizza.name}
            selectedSize={selectedOption}
            productImage={pizza.image}
            onAddToCart={handleAddToCart}
            onReturnToMenu={() => navigate("/menu")}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default PizzaARPage;
