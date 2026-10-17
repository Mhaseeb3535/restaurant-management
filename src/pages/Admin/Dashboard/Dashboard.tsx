import { Card, Col, Row } from "react-bootstrap";
import { FaShoppingCart, FaCalendarCheck, FaMoneyBillWave, FaUsers } from "react-icons/fa";
import RevenueChart from "../../../components/Dashboard/RevenueChart";
import SalesChart from "../../../components/Charts/SalesChart";
import OrderStatusPie from "../../../components/Dashboard/OrderStatusPie";
import OrdersTable from "../../../components/Dashboard/OrdersTable";

function Dashboard() {
  return (
    <>
      <h2 className="mb-4 fw-bold">Restaurant Dashboard</h2>

      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="shadow border-0 rounded-4">
            <Card.Body className="d-flex align-items-center gap-3">
              <div className="bg-warning bg-opacity-25 p-3 rounded-3">
                <FaShoppingCart size={28} className="text-warning" />
              </div>
              <div>
                <h6 className="text-muted mb-0">Orders</h6>
                <h2 className="fw-bold mb-0">254</h2>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow border-0 rounded-4">
            <Card.Body className="d-flex align-items-center gap-3">
              <div className="bg-success bg-opacity-25 p-3 rounded-3">
                <FaCalendarCheck size={28} className="text-success" />
              </div>
              <div>
                <h6 className="text-muted mb-0">Reservations</h6>
                <h2 className="fw-bold mb-0">68</h2>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow border-0 rounded-4">
            <Card.Body className="d-flex align-items-center gap-3">
              <div className="bg-primary bg-opacity-25 p-3 rounded-3">
                <FaMoneyBillWave size={28} className="text-primary" />
              </div>
              <div>
                <h6 className="text-muted mb-0">Revenue</h6>
                <h2 className="fw-bold mb-0">$15,800</h2>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow border-0 rounded-4">
            <Card.Body className="d-flex align-items-center gap-3">
              <div className="bg-info bg-opacity-25 p-3 rounded-3">
                <FaUsers size={28} className="text-info" />
              </div>
              <div>
                <h6 className="text-muted mb-0">Staff</h6>
                <h2 className="fw-bold mb-0">34</h2>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row className="mb-4">
        <Col lg={8} className="mb-4 mb-lg-0">
          <RevenueChart />
        </Col>
        <Col lg={4}>
          <OrderStatusPie />
        </Col>
      </Row>

      {/* Sales Chart & Orders Table */}
      <Row className="mb-4">
        <Col lg={6} className="mb-4 mb-lg-0">
          <SalesChart />
        </Col>
        <Col lg={6}>
          <OrdersTable />
        </Col>
      </Row>
    </>
  );
}

export default Dashboard;
