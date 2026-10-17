import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Form,
  Spinner,
} from "react-bootstrap";
import { motion } from "framer-motion";
import { FaHeart, FaStar, FaShoppingCart } from "react-icons/fa";
import Navigation from "../../components/Navbar/Navbar";
import TodaysMenu from "../../components/TodaysMenu/TodaysMenu";
import FeaturedMenu from "../../components/FeaturedMenu/FeaturedMenu";
import Footer from "../../components/Footer/Footer";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoriteContext";
import api from "../../services/api";

interface FoodItem {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  rating: number;
  available: boolean;
  special: boolean;
}

function MenuPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await api.get("/menu");
        setFoods(res.data || []);
      } catch (fetchError) {
        console.error("Failed to fetch menu", fetchError);
        setError("Unable to load menu items right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const categories = ["All", ...new Set(foods.map((food) => food.category).filter(Boolean))];

  const filteredFoods = foods.filter((food) => {
    const matchesSearch = food.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || food.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Navigation />

      {/* Hero */}

      <section
        className="text-white d-flex align-items-center"
        style={{
          minHeight: "350px",
          paddingTop: "90px",
          background:
            "linear-gradient(rgba(0,0,0,.6),rgba(0,0,0,.6)),url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600') center/cover",
        }}
      >
        <Container className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 70 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h1 className="display-3 fw-bold">Our Delicious Menu</h1>

            <p className="lead">
              Fresh • Healthy • Delicious
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Search */}

      <Container className="py-5">
        {error ? (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        ) : null}

        <Row className="justify-content-center mb-5">

          <Col lg={6}>

            <Form.Control
              size="lg"
              placeholder="Search your favorite food..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </Col>

        </Row>

        {/* Categories */}

        <div className="text-center mb-5">
          {categories.map((category) => (
            <Button
              key={category}
              className="me-2 mb-2"
              variant={selectedCategory === category ? "warning" : "outline-warning"}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}

        </div>

        {/* Food Cards */}

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="warning" />
            <p className="mt-3 mb-0">Loading menu...</p>
          </div>
        ) : (
        <Row>

          {filteredFoods.map((food, index) => (

            <Col lg={4} md={6} className="mb-4" key={food.id}>

              <motion.div
                initial={{ opacity: 0, y: 70 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >

                <Card className="border-0 shadow-lg rounded-4 h-100">

                  <div style={{ overflow: "hidden", position: "relative" }}>

                    <Button
                      variant={isFavorite(`${food.id}-${food.name}`) ? "danger" : "light"}
                      className="rounded-circle border-0 shadow-sm"
                      style={{ position: "absolute", top: 16, right: 16, zIndex: 2, width: 44, height: 44 }}
                      onClick={() =>
                        toggleFavorite({
                          favoriteId: `${food.id}-${food.name}`,
                          id: food.id,
                          name: food.name,
                          price: food.price,
                          image: food.image,
                          category: food.category,
                        })
                      }
                    >
                      <FaHeart color={isFavorite(`${food.id}-${food.name}`) ? "#fff" : "#dc3545"} />
                    </Button>

                    <Card.Img
                      src={food.image}
                      style={{
                        height: "250px",
                        objectFit: "cover",
                        transition: ".4s",
                      }}
                    />

                  </div>

                  <Card.Body>

                    <div className="d-flex justify-content-between">

                      <h4>{food.name}</h4>

                      <h5 className="text-warning">
                        ${food.price}
                      </h5>

                    </div>

                    <p className="text-muted">

                      {food.category}

                    </p>

                    <div className="mb-3">

                      <Badge bg="success" className="me-2">

                        <FaStar /> {food.rating}

                      </Badge>

                      {food.special && (

                        <Badge bg="warning" text="dark">

                          Today's Special

                        </Badge>

                      )}

                      {!food.available && (

                        <Badge bg="danger" className="ms-2">

                          Sold Out

                        </Badge>

                      )}

                    </div>

                    <div className="d-flex gap-2">
                      <Button
                        className="flex-grow-1"
                        variant="outline-warning"
                        onClick={() =>
                          navigate("/pizza-ar", {
                            state: { food },
                          })
                        }
                        disabled={!food.available || !food.name.toLowerCase().includes("pizza")}
                      >
                        View in AR
                      </Button>

                      <Button
                        className="flex-grow-1"
                        variant="warning"
                        disabled={!food.available}
                        onClick={() =>
                          addToCart({
                            id: food.id,
                            name: food.name,
                            price: food.price,
                            image: food.image,
                          })
                        }
                      >
                        <FaShoppingCart className="me-2" />
                        Add To Cart
                      </Button>
                    </div>

                  </Card.Body>

                </Card>

              </motion.div>

            </Col>

          ))}

        </Row>
        )}

      </Container>

      {/* Today's Menu Section */}

      <TodaysMenu />

      {/* Featured Menu Section */}

      <FeaturedMenu />

      {/* Bottom CTA */}

      <section className="bg-dark text-white py-5">

        <Container className="text-center">

          <h2>

            Taste the Best Food in Town

          </h2>

          <p className="mb-4">

            Every meal is prepared with fresh ingredients by our expert chefs.

          </p>

          <Button size="lg" variant="warning">

            Reserve a Table

          </Button>

        </Container>

      </section>

      <Footer />
    </>
  );
}

export default MenuPage;
