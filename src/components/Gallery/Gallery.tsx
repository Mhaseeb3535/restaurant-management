import { useState } from "react";
import { Container, Row, Col, Modal, Button } from "react-bootstrap";
import { FaArrowLeft, FaArrowRight, FaTimes } from "react-icons/fa";
import "./Gallery.css";

const galleryImages = [
  { id: 1, image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800", title: "Luxury Dining Hall" },
  { id: 2, image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800", title: "Premium Dinner" },
  { id: 3, image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800", title: "Fresh Healthy Food" },
  { id: 4, image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800", title: "Restaurant Interior" },
  { id: 5, image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800", title: "Chef Special" },
  { id: 6, image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800", title: "Family Dining" },
];

function Gallery() {
  const [showModal, setShowModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setShowModal(true);
  };

  const closeLightbox = () => setShowModal(false);

  const goPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  const current = galleryImages[currentIndex];

  return (
    <section className="gallery-section py-5">
      <Container>
        <div className="text-center mb-5">
          <span className="text-warning fw-bold">OUR GALLERY</span>
          <h2 className="display-5 fw-bold">Experience Our Beautiful Restaurant</h2>
          <p className="text-muted">Click on any photo to open the album viewer.</p>
        </div>

        <Row>
          {galleryImages.map((item, index) => (
            <Col lg={4} md={6} className="mb-4" key={item.id}>
              <div className="gallery-card" onClick={() => openLightbox(index)} style={{ cursor: "pointer" }}>
                <img src={item.image} alt={item.title} />
                <div className="gallery-overlay">
                  <h5>{item.title}</h5>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>

      <Modal show={showModal} onHide={closeLightbox} size="xl" centered className="gallery-modal">
        <Modal.Body className="p-0 position-relative" style={{ background: "#000", minHeight: "500px" }}>
          <Button variant="light" className="position-absolute top-0 end-0 m-3 rounded-circle z-3" onClick={closeLightbox} style={{ width: 40, height: 40 }}>
            <FaTimes />
          </Button>

          <div className="d-flex align-items-center justify-content-center h-100" style={{ minHeight: "500px" }}>
            <Button variant="dark" className="position-absolute start-0 ms-3 z-3 rounded-circle" onClick={goPrev} style={{ width: 50, height: 50 }}>
              <FaArrowLeft />
            </Button>

            <img src={current?.image} alt={current?.title} className="img-fluid" style={{ maxHeight: "80vh", objectFit: "contain" }} />

            <Button variant="dark" className="position-absolute end-0 me-3 z-3 rounded-circle" onClick={goNext} style={{ width: 50, height: 50 }}>
              <FaArrowRight />
            </Button>
          </div>

          <h5 className="text-white text-center py-3 m-0">{current?.title}</h5>
        </Modal.Body>
      </Modal>
    </section>
  );
}

export default Gallery;
