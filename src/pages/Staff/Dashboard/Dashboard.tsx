import { Card, Col, Row } from "react-bootstrap";
import { FaShoppingCart, FaUtensils, FaClock, FaCheckCircle } from "react-icons/fa";
import TodayOrdersChart from "../../../components/Dashboard/TodayOrdersChart";
import OrderCompletionPie from "../../../components/Dashboard/OrderCompletionPie";
import NotificationCard from "../../../components/Dashboard/NotificationCard";

function Dashboard() {
  return (
    <>
      <h2 className="mb-4 fw-bold">Staff Dashboard</h2>

      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="shadow border-0 rounded-4">
            <Card.Body className="d-flex align-items-center gap-3">
              <div className="bg-warning bg-opacity-25 p-3 rounded-3">
                <FaShoppingCart size={28} className="text-warning" />
              </div>
              <div>
                <h6 className="text-muted mb-0">Today's Orders</h6>
                <h2 className="fw-bold mb-0">54</h2>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow border-0 rounded-4">
            <Card.Body className="d-flex align-items-center gap-3">
              <div className="bg-info bg-opacity-25 p-3 rounded-3">
                <FaUtensils size={28} className="text-info" />
              </div>
              <div>
                <h6 className="text-muted mb-0">Menu Items</h6>
                <h2 className="fw-bold mb-0">36</h2>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow border-0 rounded-4">
            <Card.Body className="d-flex align-items-center gap-3">
              <div className="bg-danger bg-opacity-25 p-3 rounded-3">
                <FaClock size={28} className="text-danger" />
              </div>
              <div>
                <h6 className="text-muted mb-0">Pending</h6>
                <h2 className="fw-bold mb-0">8</h2>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow border-0 rounded-4">
            <Card.Body className="d-flex align-items-center gap-3">
              <div className="bg-success bg-opacity-25 p-3 rounded-3">
                <FaCheckCircle size={28} className="text-success" />
              </div>
              <div>
                <h6 className="text-muted mb-0">Completed</h6>
                <h2 className="fw-bold mb-0">46</h2>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row className="mb-4">
        <Col lg={7} className="mb-4 mb-lg-0">
          <TodayOrdersChart />
        </Col>
        <Col lg={5}>
          <OrderCompletionPie />
        </Col>
      </Row>

      {/* Notifications */}
      <Row>
        <Col lg={6}>
          <NotificationCard />
        </Col>
      </Row>
    </>
  );
}

export default Dashboard;
