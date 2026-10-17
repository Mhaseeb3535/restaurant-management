import { Card, Col, Row } from "react-bootstrap";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from "recharts";
import { FaChartBar, FaUsers, FaShoppingCart, FaMoneyBillWave } from "react-icons/fa";

const monthlyData = [
  { name: "Jan", revenue: 18500, orders: 420, customers: 180 },
  { name: "Feb", revenue: 19200, orders: 450, customers: 200 },
  { name: "Mar", revenue: 20100, orders: 480, customers: 220 },
  { name: "Apr", revenue: 21500, orders: 510, customers: 245 },
  { name: "May", revenue: 22800, orders: 540, customers: 260 },
  { name: "Jun", revenue: 24200, orders: 580, customers: 290 },
  { name: "Jul", revenue: 25400, orders: 610, customers: 310 },
];

const categoryPerformance = [
  { name: "Main Course", sales: 12500, percentage: 35 },
  { name: "Fast Food", sales: 8900, percentage: 25 },
  { name: "Desserts", sales: 5600, percentage: 16 },
  { name: "Beverages", sales: 4800, percentage: 13 },
  { name: "Appetizers", sales: 4100, percentage: 11 },
];

function Analytics() {
  const totalRevenue = monthlyData.reduce((s, d) => s + d.revenue, 0);
  const totalOrders = monthlyData.reduce((s, d) => s + d.orders, 0);
  const avgOrderValue = Math.round(totalRevenue / totalOrders);

  return (
    <>
      <h2 className="mb-4">Advanced Analytics</h2>

      <Row className="mb-4">
        <Col md={3}>
          <Card className="shadow border-0 text-center">
            <Card.Body>
              <FaMoneyBillWave size={30} className="text-warning mb-2" />
              <h6 className="text-muted">Total Revenue (YTD)</h6>
              <h3>${totalRevenue.toLocaleString()}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow border-0 text-center">
            <Card.Body>
              <FaShoppingCart size={30} className="text-primary mb-2" />
              <h6 className="text-muted">Total Orders</h6>
              <h3>{totalOrders.toLocaleString()}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow border-0 text-center">
            <Card.Body>
              <FaUsers size={30} className="text-success mb-2" />
              <h6 className="text-muted">Total Customers</h6>
              <h3>1,705</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow border-0 text-center">
            <Card.Body>
              <FaChartBar size={30} className="text-info mb-2" />
              <h6 className="text-muted">Avg Order Value</h6>
              <h3>${avgOrderValue}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={8}>
          <Card className="shadow border-0 rounded-4 mb-4">
            <Card.Body>
              <h5 className="mb-4">Revenue & Orders Overview</h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="revenue" fill="#ffc107" name="Revenue ($)" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="orders" fill="#0d6efd" name="Orders" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="shadow border-0 rounded-4 mb-4">
            <Card.Body>
              <h5 className="mb-4">Category Performance</h5>
              {categoryPerformance.map((cat) => (
                <div key={cat.name} className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span>{cat.name}</span>
                    <span className="fw-bold">${cat.sales.toLocaleString()}</span>
                  </div>
                  <div className="progress" style={{ height: "8px" }}>
                    <div
                      className="progress-bar bg-warning"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                  <small className="text-muted">{cat.percentage}% of total sales</small>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <Card className="shadow border-0 rounded-4">
            <Card.Body>
              <h5 className="mb-4">Customer Growth Trend</h5>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="customers" stroke="#198754" strokeWidth={2} name="New Customers" dot={{ fill: "#198754" }} />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default Analytics;

