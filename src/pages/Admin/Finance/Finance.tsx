import { Card, Col, Row, Table } from "react-bootstrap";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

interface Transaction {
  id: number;
  description: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  status: "Completed" | "Pending";
}

function Finance() {
  const transactions: Transaction[] = [
    { id: 1, description: "Order Payments (24 orders)", category: "Sales", amount: 1850, type: "income", date: "25 July 2026", status: "Completed" },
    { id: 2, description: "Vegetable Supply", category: "Inventory", amount: 450, type: "expense", date: "25 July 2026", status: "Completed" },
    { id: 3, description: "Staff Salaries", category: "Payroll", amount: 3200, type: "expense", date: "24 July 2026", status: "Completed" },
    { id: 4, description: "Online Order Revenue", category: "Sales", amount: 980, type: "income", date: "24 July 2026", status: "Completed" },
    { id: 5, description: "Utility Bills", category: "Utilities", amount: 340, type: "expense", date: "23 July 2026", status: "Pending" },
    { id: 6, description: "Catering Service", category: "Services", amount: 2500, type: "income", date: "23 July 2026", status: "Completed" },
    { id: 7, description: "Meat & Poultry", category: "Inventory", amount: 890, type: "expense", date: "22 July 2026", status: "Completed" },
    { id: 8, description: "Bar Revenue", category: "Sales", amount: 760, type: "income", date: "22 July 2026", status: "Completed" },
  ];

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalIncome - totalExpense;

  return (
    <>
      <h2 className="mb-4">Finance Overview</h2>

      <Row className="mb-4">
        <Col md={4}>
          <Card className="shadow border-0 text-center border-start border-success border-4">
            <Card.Body>
              <h6 className="text-muted">Total Income</h6>
              <h2 className="text-success">${totalIncome.toLocaleString()}</h2>
              <small className="text-success"><FaArrowUp /> +12% from last month</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow border-0 text-center border-start border-danger border-4">
            <Card.Body>
              <h6 className="text-muted">Total Expenses</h6>
              <h2 className="text-danger">${totalExpense.toLocaleString()}</h2>
              <small className="text-danger"><FaArrowUp /> +5% from last month</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow border-0 text-center border-start border-warning border-4">
            <Card.Body>
              <h6 className="text-muted">Net Profit</h6>
              <h2 className="text-warning">${netProfit.toLocaleString()}</h2>
              <small className="text-success"><FaArrowDown /> -2% from last month</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card className="shadow border-0 rounded-4 mb-4">
            <Card.Body>
              <h5 className="mb-3">Income Breakdown</h5>
              <Table borderless size="sm">
                <tbody>
                  {["Sales", "Services", "Other"].map((cat) => {
                    const total = transactions.filter((t) => t.type === "income" && t.category === cat).reduce((s, t) => s + t.amount, 0);
                    return (
                      <tr key={cat}>
                        <td>{cat}</td>
                        <td className="text-success fw-bold">${total}</td>
                        <td>
                          <div className="progress" style={{ height: "8px" }}>
                            <div className="progress-bar bg-success" style={{ width: `${(total / totalIncome) * 100}%` }} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow border-0 rounded-4 mb-4">
            <Card.Body>
              <h5 className="mb-3">Expense Breakdown</h5>
              <Table borderless size="sm">
                <tbody>
                  {["Inventory", "Payroll", "Utilities"].map((cat) => {
                    const total = transactions.filter((t) => t.type === "expense" && t.category === cat).reduce((s, t) => s + t.amount, 0);
                    return (
                      <tr key={cat}>
                        <td>{cat}</td>
                        <td className="text-danger fw-bold">${total}</td>
                        <td>
                          <div className="progress" style={{ height: "8px" }}>
                            <div className="progress-bar bg-danger" style={{ width: `${(total / totalExpense) * 100}%` }} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow border-0 rounded-4">
        <Card.Body>
          <h5 className="mb-4">Recent Transactions</h5>
          <Table hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>{t.description}</td>
                  <td>{t.category}</td>
                  <td className={t.type === "income" ? "text-success fw-bold" : "text-danger fw-bold"}>
                    {t.type === "income" ? "+" : "-"}${t.amount}
                  </td>
                  <td>
                    <span className={`badge bg-${t.type === "income" ? "success" : "danger"}`}>
                      {t.type}
                    </span>
                  </td>
                  <td>{t.date}</td>
                  <td>
                    <span className={`badge bg-${t.status === "Completed" ? "success" : "warning"}`}>
                      {t.status}
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

