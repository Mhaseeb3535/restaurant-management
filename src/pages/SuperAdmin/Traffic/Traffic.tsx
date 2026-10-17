import { Card, Col, Row, Table } from "react-bootstrap";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { FaUsers, FaUserPlus, FaUserCheck, FaUserTimes } from "react-icons/fa";

const hourlyTraffic = [
  { hour: "8AM", visitors: 15 },
  { hour: "9AM", visitors: 28 },
  { hour: "10AM", visitors: 45 },
  { hour: "11AM", visitors: 62 },
  { hour: "12PM", visitors: 120 },
  { hour: "1PM", visitors: 155 },
  { hour: "2PM", visitors: 110 },
  { hour: "3PM", visitors: 48 },
  { hour: "4PM", visitors: 35 },
  { hour: "5PM", visitors: 55 },
  { hour: "6PM", visitors: 98 },
  { hour: "7PM", visitors: 145 },
  { hour: "8PM", visitors: 160 },
  { hour: "9PM", visitors: 130 },
  { hour: "10PM", visitors: 75 },
];

const peakDays = [
  { day: "Monday", visitors: 320 },
  { day: "Tuesday", visitors: 280 },
  { day: "Wednesday", visitors: 350 },
  { day: "Thursday", visitors: 400 },
  { day: "Friday", visitors: 580 },
  { day: "Saturday", visitors: 720 },
  { day: "Sunday", visitors: 650 },
];

const customerSegments = [
  { name: "Regulars", value: 45 },
  { name: "New", value: 25 },
  { name: "Occasional", value: 20 },
  { name: "VIP", value: 10 },
];

const COLORS = ["#ffc107", "#0d6efd", "#198754", "#dc3545"];

function Traffic() {
  const avgDaily = Math.round(peakDays.reduce((s, d) => s + d.visitors, 0) / 7);
  const peakHour = hourlyTraffic.reduce((max, h) => (h.visitors > max.visitors ? h : max), hourlyTraffic[0]);
  const peakDay = peakDays.reduce((max, d) => (d.visitors > max.visitors ? d : max), peakDays[0]);
  const totalWeekly = peakDays.reduce((s, d) => s + d.visitors, 0);

  return (
    <>
      <h2 className="mb-4">Customer Traffic Analytics</h2>

      <Row className="mb-4">
        <Col md={3}>
          <Card className="shadow border-0 text-center">
            <Card.Body>
              <FaUsers size={28} className="text-primary mb-2" />
              <h6 className="text-muted">Avg Daily Visitors</h6>
              <h3>{avgDaily}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow border-0 text-center">
            <Card.Body>
              <FaUserPlus size={28} className="text-success mb-2" />
              <h6 className="text-muted">Peak Day</h6>
              <h3>{peakDay.day}</h3>
              <small className="text-muted">{peakDay.visitors} visitors</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow border-0 text-center">
            <Card.Body>
              <FaUserCheck size={28} className="text-warning mb-2" />
              <h6 className="text-muted">Peak Hour</h6>
              <h3>{peakHour.hour}</h3>
              <small className="text-muted">{peakHour.visitors} visitors</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow border-0 text-center">
            <Card.Body>
              <FaUserTimes size={28} className="text-danger mb-2" />
              <h6 className="text-muted">Weekly Total</h6>
              <h3>{totalWeekly.toLocaleString()}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={8}>
          <Card className="shadow border-0 rounded-4 mb-4">
            <Card.Body>
              <h5 className="mb-4">Hourly Traffic (Today)</h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={hourlyTraffic}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="visitors" fill="#ffc107" name="Visitors" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="shadow border-0 rounded-4 mb-4">
            <Card.Body>
              <h5 className="mb-4">Customer Segments</h5>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={customerSegments} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                    {customerSegments.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <Card className="shadow border-0 rounded-4">
            <Card.Body>
              <h5 className="mb-4">Weekly Traffic</h5>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={peakDays}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="visitors" fill="#0d6efd" name="Visitors" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col lg={12}>
          <Card className="shadow border-0 rounded-4">
            <Card.Body>
              <h5 className="mb-4">Traffic Summary by Day</h5>
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>Day</th>
                    <th>Visitors</th>
                    <th>% of Weekly</th>
                    <th>Traffic Level</th>
                  </tr>
                </thead>
                <tbody>
                  {peakDays.map((d) => (
                    <tr key={d.day}>
                      <td><strong>{d.day}</strong></td>
                      <td>{d.visitors}</td>
                      <td>{((d.visitors / totalWeekly) * 100).toFixed(1)}%</td>
                      <td>
                        <div className="progress" style={{ height: "8px" }}>
                          <div
                            className={`progress-bar ${d.visitors >= 600 ? "bg-danger" : d.visitors >= 400 ? "bg-warning" : "bg-success"}`}
                            style={{ width: `${(d.visitors / 720) * 100}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default Traffic;

