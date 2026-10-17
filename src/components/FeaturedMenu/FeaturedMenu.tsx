import { Card, Button, Container, Row, Col } from "react-bootstrap";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoriteContext";
import "./FeaturedMenu.css";

const dishes = [
  {
    id: 1,
    name: "Grilled Steak",
    price: 22,
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=600",
    description: "Premium grilled beef served with vegetables.",
  },
  {
    id: 2,
    name: "Italian Pizza",
    price: 18,
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600",
    description: "Wood-fired pizza with mozzarella cheese.",
  },
  {
    id: 3,
    name: "Creamy Pasta",
    price: 16,
    image:
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600",
    description: "Fresh pasta with creamy Alfredo sauce.",
  },
];

function FeaturedMenu() {
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <section className="featured-section py-5">
      <Container>
        <h2 className="text-center mb-5 fw-bold">
          Today's Special
        </h2>

        <Row>
          {dishes.map((dish) => (
            <Col md={4} key={dish.id} className="mb-4">
              <Card className="food-card shadow">
                <div style={{ position: "relative" }}>
                  <Button
                    variant={isFavorite(`${dish.id}-${dish.name}`) ? "danger" : "light"}
                    className="rounded-circle border-0 shadow-sm"
                    style={{ position: "absolute", top: 16, right: 16, zIndex: 2, width: 42, height: 42 }}
                    onClick={() =>
                      toggleFavorite({
                        favoriteId: `${dish.id}-${dish.name}`,
                        id: dish.id,
                        name: dish.name,
                        price: dish.price,
                        image: dish.image,
                      })
                    }
                  >
                    <FaHeart color={isFavorite(`${dish.id}-${dish.name}`) ? "#fff" : "#dc3545"} />
                  </Button>
                  <Card.Img variant="top" src={dish.image} />
                </div>

                <Card.Body>
                  <Card.Title>{dish.name}</Card.Title>

                  <Card.Text>{dish.description}</Card.Text>

                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="text-warning">${dish.price}</h5>

                    <Button
                      variant="dark"
                      onClick={() =>
                        addToCart({
                          id: dish.id,
                          name: dish.name,
                          price: dish.price,
                          image: dish.image,
                        })
                      }
                    >
                      <FaShoppingCart className="me-1" /> Add to Cart
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}

export default FeaturedMenu;
