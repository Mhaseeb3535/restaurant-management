import { Button, Card, Col, Image, Row } from "react-bootstrap";
import { FaHeart, FaShoppingCart, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoriteContext";

function Favorites() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { favorites, removeFavorite } = useFavorites();

  return (
    <>
      <h3 className="mb-4">My Favorites</h3>

      {favorites.length === 0 ? (
        <Card className="shadow border-0 rounded-4 text-center py-5">
          <Card.Body>
            <FaHeart size={48} className="text-danger mb-3" />
            <h5 className="mb-2">No favorite items yet</h5>
            <p className="text-muted mb-3">
              Tap the heart icon on menu items to save them here.
            </p>
            <Button variant="warning" onClick={() => navigate("/menu")}>
              Browse Menu
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {favorites.map((item) => (
            <Col md={6} xl={4} key={item.favoriteId} className="mb-4">
              <Card className="shadow border-0 rounded-4 h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <Image
                      src={item.image}
                      alt={item.name}
                      rounded
                      style={{ width: 84, height: 84, objectFit: "cover" }}
                    />
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => removeFavorite(item.favoriteId)}
                    >
                      <FaTrash />
                    </Button>
                  </div>

                  <h5 className="fw-bold">{item.name}</h5>
                  <p className="text-muted mb-2">{item.category || "Favorite item"}</p>
                  <h6 className="text-warning mb-4">${item.price.toFixed(2)}</h6>

                  <div className="d-flex gap-2">
                    <Button
                      variant="warning"
                      className="flex-fill"
                      onClick={() =>
                        addToCart({
                          id: item.id,
                          name: item.name,
                          price: item.price,
                          image: item.image,
                        })
                      }
                    >
                      <FaShoppingCart className="me-2" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline-danger"
                      className="flex-fill"
                      onClick={() => removeFavorite(item.favoriteId)}
                    >
                      <FaHeart className="me-2" />
                      Unfavorite
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </>
  );
}

export default Favorites;
