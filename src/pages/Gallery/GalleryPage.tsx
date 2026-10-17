import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Container,
  Row,
  Col,
  Card,
  Button,
} from "react-bootstrap";
import { motion } from "framer-motion";
import {
  FaUtensils,
  FaGlassCheers,
  FaHotel,
  FaCamera,
} from "react-icons/fa";

import Navigation from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import api from "../../services/api";

import "./GalleryPage.css";

interface GalleryItem {
  id: number;
  title: string;
  image: string;
  category: string;
  description: string;
  source?: "menu";
}

interface MenuItem {
  id: number;
  name: string;
  image: string;
  category: string;
  description?: string;
}

function GalleryPage() {
  const navigate = useNavigate();
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [pizzaMenuItem, setPizzaMenuItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadGallery = async () => {
      const [galleryResult, menuResult] = await Promise.allSettled([
        api.get<GalleryItem[]>("/gallery"),
        api.get<MenuItem[]>("/menu"),
      ]);

      if (galleryResult.status === "fulfilled") {
        setGalleryItems(galleryResult.value.data);
      } else {
        console.error("Failed to load gallery items", galleryResult.reason);
        setError("Unable to load gallery images right now.");
      }

      if (menuResult.status === "fulfilled") {
        const pizza = menuResult.value.data.find(
          (item) =>
            item.name.toLowerCase().includes("pizza") ||
            item.category.toLowerCase().includes("pizza"),
        );
        setPizzaMenuItem(pizza ?? null);
      } else {
        console.error("Failed to load the menu pizza for the gallery", menuResult.reason);
        setError((currentError) =>
          currentError
            ? `${currentError} The menu pizza image could not be added.`
            : "The menu pizza image could not be added to the gallery.",
        );
      }

        setLoading(false);
    };

    void loadGallery();
  }, []);

  const itemsToDisplay = [
    ...galleryItems.map((item) => ({ ...item, source: undefined })),
    ...(pizzaMenuItem
      ? [
          {
            id: pizzaMenuItem.id,
            title: pizzaMenuItem.name,
            image: pizzaMenuItem.image,
            category: "Food",
            description:
              pizzaMenuItem.description || "Featured on our restaurant menu.",
            source: "menu" as const,
          },
        ]
      : []),
  ];

  const filteredGallery =
    filter === "All"
      ? itemsToDisplay
      : itemsToDisplay.filter(
          (item) => item.category === filter
        );

  return (
    <>
      <Navigation />

      {/* HERO */}

      <section className="galleryHero">

        <div className="galleryOverlay">

          <Container>

            <motion.div
              initial={{
                opacity: 0,
                y: 80,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: .8,
              }}
              className="text-center text-white"
            >

              <h1>

                Our Gallery

              </h1>

              <div className="heroLine"></div>

              <p>

                Explore our restaurant,
                delicious dishes,
                memorable events
                and beautiful atmosphere.

              </p>

            </motion.div>

          </Container>

        </div>

      </section>

      {/* FILTER */}

      <Container className="py-5">
        {error ? (
          <Alert variant="warning" className="mb-4">
            {error}
          </Alert>
        ) : null}

        <div className="text-center mb-5">

          <Button
            className="m-2"
            variant={
              filter === "All"
                ? "warning"
                : "outline-warning"
            }
            onClick={() => setFilter("All")}
          >
            All
          </Button>

          <Button
            className="m-2"
            variant={
              filter === "Food"
                ? "warning"
                : "outline-warning"
            }
            onClick={() => setFilter("Food")}
          >
            <FaUtensils className="me-2" />

            Food

          </Button>

          <Button
            className="m-2"
            variant={
              filter === "Interior"
                ? "warning"
                : "outline-warning"
            }
            onClick={() => setFilter("Interior")}
          >
            <FaHotel className="me-2" />

            Interior

          </Button>

          <Button
            className="m-2"
            variant={
              filter === "Events"
                ? "warning"
                : "outline-warning"
            }
            onClick={() => setFilter("Events")}
          >
            <FaGlassCheers className="me-2" />

            Events

          </Button>

          <Button
            className="m-2"
            variant={
              filter === "VIP"
                ? "warning"
                : "outline-warning"
            }
            onClick={() => setFilter("VIP")}
          >
            <FaCamera className="me-2" />

            VIP

          </Button>

        </div>

        {loading ? (

          <h3 className="text-center">

            Loading Gallery...

          </h3>

        ) : (

          <Row>

            {filteredGallery.map((item) => (

              <Col
                lg={4}
                md={6}
                className="mb-4"
                key={item.source === "menu" ? `menu-${item.id}` : `gallery-${item.id}`}
              >

                <motion.div

                  whileHover={{
                    y: -10,
                    scale: 1.03,
                  }}

                >

                  <Card className="galleryCard">

                    <div className="galleryImage">

                      <Card.Img

                        src={item.image}

                        alt={item.title}

                      />

                    </div>

                    <Card.Body>

                      <h4>

                        {item.title}

                      </h4>

                      <span className="galleryBadge">

                        {item.category}

                      </span>

                      <p>

                        {item.description}

                      </p>
                      {item.source === "menu" ? (
                        <Button
                          variant="outline-warning"
                          onClick={() => navigate("/menu")}
                        >
                          View on menu
                        </Button>
                      ) : null}

                    </Card.Body>

                  </Card>

                </motion.div>

              </Col>

            ))}

          </Row>

        )}

      </Container>

      {/* CTA */}

      <section className="galleryCTA">

        <Container className="text-center">

          <motion.div

            initial={{
              opacity:0,
              y:50,
            }}

            whileInView={{
              opacity:1,
              y:0,
            }}

          >

            <h2>

              Capture Beautiful Moments With Us

            </h2>

            <p>

              Reserve your table and
              create unforgettable memories.

            </p>
           <Button
           variant="dark"
           size="lg"
           onClick={() => navigate("/reservation")}
           >
            Book Table
           </Button>
          </motion.div>

        </Container>

      </section>

      <Footer />

    </>
  );

}

export default GalleryPage;