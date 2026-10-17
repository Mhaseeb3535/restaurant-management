import { Container, Row, Col, Card, Badge, Button } from "react-bootstrap";
import { FaHeart, FaShoppingCart, FaStar } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoriteContext";
import "./TodaysMenu.css";

const menuItems = [
  {
    id: 1,
    name: "Diego Beef Steak",
    category: "Main Course",
    price: 24.99,
    rating: 4.9,
    available: true,
    updatedBy: "Chef Ahmed",
    updatedTime: "10:30 AM",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=900",
  },
  {
    id: 2,
    name: "Italian Pizza",
    category: "Pizza",
    price: 18.50,
    rating: 4.8,
    available: true,
    updatedBy: "Chef Ali",
    updatedTime: "11:15 AM",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900",
  },
  {
    id: 3,
    name: "Chocolate Dessert",
    category: "Dessert",
    price: 12.00,
    rating: 4.7,
    available: false,
    updatedBy: "Chef Sarah",
    updatedTime: "09:00 AM",
    image:
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=900",
  },
];

function TodaysMenu() {
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <section className="today-menu py-5">
      <Container>
        <div className="text-center mb-5">
          <span className="text-warning fw-bold">
            TODAY'S MENU
          </span>
          <h2 className="display-5 fw-bold">
            Freshly Prepared Today
          </h2>
          <p className="text-muted">
            Updated by our chefs in real time.
          </p>
        </div>

        <Row>
          {menuItems.map((item) => (
            <Col lg={4} md={6} key={item.id} className="mb-4">
              <Card className="menu-card shadow">
                <div className="menu-image">
                  <img src={item.image} alt={item.name} />
                  <Button
                    className="favorite-btn"
                    onClick={() =>
                      toggleFavorite({
                        favoriteId: `${item.id}-${item.name}`,
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        image: item.image,
                        category: item.category,
                      })
                    }
                    style={{
                      background: isFavorite(`${item.id}-${item.name}`) ? "#dc3545" : "rgba(0,0,0,0.5)",
                      border: "none",
                    }}
                  >
                    <FaHeart color={isFavorite(`${item.id}-${item.name}`) ? "#fff" : "#ccc"} />
                  </Button>
                </div>

                <Card.Body>
                  <div className="d-flex justify-content-between">
                    <Badge bg="warning">{item.category}</Badge>
                    <Badge bg={item.available ? "success" : "danger"}>
                      {item.available ? "Available" : "Sold Out"}
                    </Badge>
                  </div>

                  <h4 className="mt-3">{item.name}</h4>

                  <div className="d-flex justify-content-between mt-3">
                    <h5 className="text-warning">${item.price.toFixed(2)}</h5>
                    <span>
                      <FaStar className="text-warning" /> {item.rating}
                    </span>
                  </div>

                  <small className="text-muted d-block mt-3">
                    Updated by {item.updatedBy}
                  </small>
                  <small className="text-muted">{item.updatedTime}</small>

                  <Button
                    className="w-100 mt-4"
                    variant="dark"
                    disabled={!item.available}
                    onClick={() =>
                      addToCart({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        image: item.image,
                      })
                    }
                  >
                    <FaShoppingCart /> Add To Cart
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}

export default TodaysMenu;
