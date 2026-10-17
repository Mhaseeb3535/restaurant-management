import { Card, Col, Row } from "react-bootstrap";
import { FaUsers, FaUserTie, FaMoneyBillWave, FaShoppingBag } from "react-icons/fa";
import FinanceChart from "../../../components/Charts/FinanceChart";
import TrafficChart from "../../../components/Dashboard/TrafficChart";
import CustomerChart from "../../../components/Charts/CustomerChart";
import StaffPerformanceChart from "../../../components/Dashboard/StaffPerformanceChart";

function Dashboard() {
  return (
    <>
      <h2 className="mb-4 fw-bold">Super Admin Dashboard</h2>

      {/* Summary Cards */}
      <Row className="mb-4">
        <Col lg={3}>
          <Card className="shadow border-0 rounded-4">
            <Card.Body className="d-flex align-items-center gap-3">
              <div className="bg-primary bg-opacity-25 p-3 rounded-3">
                <FaUsers size={28} className="text-primary" />
              </div>
              <div>
                <h6 className="text-muted mb-0">Total Customers</h6>
                <h2 className="fw-bold mb-0">18,542</h2>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3}>
          <Card className="shadow border-0 rounded-4">
            <Card.Body className="d-flex align-items-center gap-3">
              <div className="bg-success bg-opacity-25 p-3 rounded-3">
                <FaUserTie size={28} className="text-success" />
              </div>
              <div>
                <h6 className="text-muted mb-0">Total Staff</h6>
                <h2 className="fw-bold mb-0">86</h2>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3}>
          <Card className="shadow border-0 rounded-4">
            <Card.Body className="d-flex align-items-center gap-3">
              <div className="bg-warning bg-opacity-25 p-3 rounded-3">
                <FaMoneyBillWave size={28} className="text-warning" />
              </div>
              <div>
                <h6 className="text-muted mb-0">Total Revenue</h6>
                <h2 className="fw-bold mb-0">$254,000</h2>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3}>
          <Card className="shadow border-0 rounded-4">
            <Card.Body className="d-flex align-items-center gap-3">
              <div className="bg-info bg-opacity-25 p-3 rounded-3">
                <FaShoppingBag size={28} className="text-info" />
              </div>
              <div>
                <h6 className="text-muted mb-0">Today's Orders</h6>
                <h2 className="fw-bold mb-0">328</h2>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts Row 1 */}
      <Row className="mb-4">
        <Col lg={7} className="mb-4 mb-lg-0">
          <FinanceChart />
        </Col>
        <Col lg={5}>
          <CustomerChart />
        </Col>
      </Row>

      {/* Charts Row 2 */}
      <Row>
        <Col lg={7} className="mb-4 mb-lg-0">
          <TrafficChart />
        </Col>
        <Col lg={5}>
          <StaffPerformanceChart />
        </Col>
      </Row>
    </>
  );
}

export default Dashboard;
