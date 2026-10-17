import { Container, Row, Col, Card } from "react-bootstrap";
import { FaStar } from "react-icons/fa";
import "./Testimonials.css";

const reviews = [
  {
    id: 1,
    name: "Muhammad Ali",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    review:
      "Amazing food, beautiful atmosphere and excellent customer service. Highly recommended!",
  },
  {
    id: 2,
    name: "Sarah Khan",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    review:
      "One of the best restaurants I've visited. Everything was fresh and delicious.",
  },
  {
    id: 3,
    name: "Ahmed Raza",
    image: "https://randomuser.me/api/portraits/men/68.jpg",
    review:
      "Professional staff, luxury environment and quick service. Definitely coming again!",
  },
];

function Testimonials() {
  return (
    <section className="testimonial-section py-5">
      <Container>

        <div className="text-center mb-5">
          <span className="text-warning fw-bold">
            CUSTOMER REVIEWS
          </span>

          <h2 className="display-5 fw-bold">
            What Our Customers Say
          </h2>

          <p className="text-muted">
            Thousands of happy customers trust us every day.
          </p>
        </div>

        <Row>

          {reviews.map((review) => (

            <Col lg={4} md={6} className="mb-4" key={review.id}>

              <Card className="testimonial-card shadow">

                <Card.Body className="text-center">

                  <img
                    src={review.image}
                    alt={review.name}
                    className="customer-image"
                  />

                  <h4 className="mt-3">
                    {review.name}
                  </h4>

                  <div className="mb-3">

                    <FaStar className="text-warning" />
                    <FaStar className="text-warning" />
                    <FaStar className="text-warning" />
                    <FaStar className="text-warning" />
                    <FaStar className="text-warning" />

                  </div>

                  <p className="text-muted">
                    {review.review}
                  </p>

                </Card.Body>

              </Card>

            </Col>

          ))}

        </Row>

      </Container>
    </section>
  );
}

export default Testimonials;