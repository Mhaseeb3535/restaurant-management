import { Card, Col, Row, Table } from "react-bootstrap";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from "recharts";

const monthlyFinance = [
  { month: "Jan", revenue: 18500, expenses: 12000, profit: 6500 },
  { month: "Feb", revenue: 19200, expenses: 12500, profit: 6700 },
  { month: "Mar", revenue: 20100, expenses: 13100, profit: 7000 },
  { month: "Apr", revenue: 21500, expenses: 13800, profit: 7700 },
  { month: "May", revenue: 22800, expenses: 14200, profit: 8600 },
  { month: "Jun", revenue: 24200, expenses: 15100, profit: 9100 },
  { month: "Jul", revenue: 25400, expenses: 15800, profit: 9600 },
];

interface PendingPayment {
  id: number;
  vendor: string;
  description: string;
  amount: number;
  dueDate: string;
  status: "Due" | "Overdue" | "Paid";
}

function Finance() {
  const totalRevenue = monthlyFinance.reduce((s, d) => s + d.revenue, 0);
  const totalExpenses = monthlyFinance.reduce((s, d) => s + d.expenses, 0);
  const totalProfit = monthlyFinance.reduce((s, d) => s + d.profit, 0);
  const profitMargin = ((totalProfit / totalRevenue) * 100).toFixed(1);

  const pendingPayments: PendingPayment[] = [
    { id: 1, vendor: "Fresh Foods Supply", description: "Vegetable delivery - July", amount: 1200, dueDate: "30 Jul 2026", status: "Due" },
    { id: 2, vendor: "Meat & Poultry Co.", description: "Chicken & Beef supply", amount: 2400, dueDate: "28 Jul 2026", status: "Overdue" },
    { id: 3, vendor: "Beverages Ltd", description: "Soft drink stock", amount: 850, dueDate: "05 Aug 2026", status: "Due" },
    { id: 4, vendor: "Utility Provider", description: "Electricity bill", amount: 520, dueDate: "15 Aug 2026", status: "Paid" },
  ];

  return (
    <>
      <h2 className="mb-4">Financial Overview</h2>

      <Row className="mb-4">
        <Col md={4}>
          <Card className="shadow border-0 text-center border-start border-success border-4">
            <Card.Body>
              <h6 className="text-muted">Total Revenue (YTD)</h6>
              <h2 className="text-success">${totalRevenue.toLocaleString()}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow border-0 text-center border-start border-danger border-4">
            <Card.Body>
              <h6 className="text-muted">Total Expenses</h6>
              <h2 className="text-danger">${totalExpenses.toLocaleString()}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow border-0 text-center border-start border-warning border-4">
            <Card.Body>
              <h6 className="text-muted">Net Profit</h6>
              <h2 className="text-warning">${totalProfit.toLocaleString()}</h2>
              <small className="text-success">Margin: {profitMargin}%</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={8}>
          <Card className="shadow border-0 rounded-4 mb-4">
            <Card.Body>
              <h5 className="mb-4">Revenue vs Expenses</h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyFinance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#198754" name="Revenue" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" fill="#dc3545" name="Expenses" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="shadow border-0 rounded-4 mb-4">
            <Card.Body>
              <h5 className="mb-4">Profit Trend</h5>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyFinance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="profit" stroke="#ffc107" strokeWidth={3} name="Profit" dot={{ fill: "#ffc107", r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow border-0 rounded-4 mb-4">
        <Card.Body>
          <h5 className="mb-4">Monthly Breakdown</h5>
          <Table hover responsive>
            <thead>
              <tr>
                <th>Month</th>
                <th>Revenue</th>
                <th>Expenses</th>
                <th>Profit</th>
                <th>Margin</th>
              </tr>
            </thead>
            <tbody>
              {monthlyFinance.map((m) => (
                <tr key={m.month}>
                  <td><strong>{m.month}</strong></td>
                  <td className="text-success">${m.revenue.toLocaleString()}</td>
                  <td className="text-danger">${m.expenses.toLocaleString()}</td>
                  <td className="text-warning fw-bold">${m.profit.toLocaleString()}</td>
                  <td>{((m.profit / m.revenue) * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Card className="shadow border-0 rounded-4">
        <Card.Body>
          <h5 className="mb-4">Pending Payments</h5>
          <Table hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Vendor</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {pendingPayments.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.vendor}</td>
                  <td>{p.description}</td>
                  <td className="fw-bold">${p.amount}</td>
                  <td>{p.dueDate}</td>
                  <td>
                    <span className={`badge bg-${p.status === "Paid" ? "success" : p.status === "Overdue" ? "danger" : "warning"}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </>
  );
}

export default Finance;

