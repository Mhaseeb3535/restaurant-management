import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Badge,
} from "react-bootstrap";
import {
  FaStar,
  FaHeart,
  FaShoppingCart,
  FaSearch,
} from "react-icons/fa";
import { motion } from "framer-motion";

interface Food {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  rating: number;
  available: boolean;
}

function MenuPage() {

  const [search, setSearch] = useState("");

  const foods: Food[] = [
    {
      id: 1,
      name: "Chicken Biryani",
      category: "Main Course",
      price: 12,
      rating: 5,
      available: true,
      image:
        "https://images.unsplash.com/photo-1563379091339-03246963d51a?w=600",
    },
    {
      id: 2,
      name: "Pepperoni Pizza",
      category: "Pizza",
      price: 18,
      rating: 5,
      available: true,
      image:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600",
    },
    {
      id: 3,
      name: "Zinger Burger",
      category: "Fast Food",
      price: 9,
      rating: 4,
      available: true,
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600",
    },
    {
      id: 4,
      name: "Chocolate Cake",
      category: "Dessert",
      price: 8,
      rating: 5,
      available: false,
      image:
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600",
    },
    {
      id: 5,
      name: "Pasta Alfredo",
      category: "Pasta",
      price: 15,
      rating: 4,
      available: true,
      image:
        "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600",
    },
    {
      id: 6,
      name: "Fresh Juice",
      category: "Drinks",
      price: 6,
      rating: 5,
      available: true,
      image:
        "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=600",
    },
  ];

  const filtered = foods.filter((food) =>
    food.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Hero */}

      <section className="bg-dark text-white py-5 mt-5">

        <Container className="text-center">

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
          >

            <h1 className="display-3 fw-bold">

              Our Delicious Menu

            </h1>

            <p>

              Fresh ingredients • Amazing Taste • Premium Quality

            </p>

          </motion.div>

        </Container>

      </section>

      {/* Search */}

      <Container className="py-5">

        <Row className="mb-4">

          <Col md={6} className="mx-auto">

            <Form.Group>

              <div className="position-relative">

                <FaSearch
                  className="position-absolute"
                  style={{
                    top: "15px",
                    left: "15px",
                  }}
                />

                <Form.Control
                  style={{ paddingLeft: "40px" }}
                  placeholder="Search food..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

              </div>

            </Form.Group>

          </Col>

        </Row>

        {/* Categories */}

        <div className="text-center mb-5">

          <Button variant="warning" className="m-2">
            All
          </Button>

          <Button variant="outline-warning" className="m-2">
            Pizza
          </Button>

          <Button variant="outline-warning" className="m-2">
            Burger
          </Button>

          <Button variant="outline-warning" className="m-2">
            Dessert
          </Button>

          <Button variant="outline-warning" className="m-2">
            Drinks
          </Button>

        </div>

        {/* Food Cards */}

        <Row>

          {filtered.map((food) => (

            <Col
              lg={4}
              md={6}
              className="mb-4"
              key={food.id}
            >

              <motion.div
                whileHover={{
                  scale: 1.03,
                }}
              >

                <Card className="shadow border-0 rounded-4 h-100">

                  <Card.Img
                    src={food.image}
                    style={{
                      height: 250,
                      objectFit: "cover",
                    }}
                  />

                  <Card.Body>

                    <div className="d-flex justify-content-between">

                      <h4>{food.name}</h4>

                      <FaHeart
                        color="red"
                        size={22}
                      />

                    </div>

                    <Badge
                      bg="warning"
                      className="mb-2"
                    >
                      {food.category}
                    </Badge>

                    <div className="mb-2">

                      {[...Array(food.rating)].map((_, i) => (

                        <FaStar
                          key={i}
                          color="gold"
                        />

                      ))}

                    </div>

                    <h3 className="text-warning">

                      ${food.price}

                    </h3>

                    {food.available ? (

                      <Badge bg="success">

                        Available

                      </Badge>

                    ) : (

                      <Badge bg="danger">

                        Sold Out

                      </Badge>

                    )}

                    <div className="d-grid mt-4">

                      <Button variant="dark">

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

      </Container>
    </>
  );
}

export default MenuPage; 