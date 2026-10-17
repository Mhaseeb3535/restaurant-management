import { useState } from "react";
import { Badge, Button, Card, Col, Form, Row, Table } from "react-bootstrap";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  orders: number;
  totalSpent: number;
  joinDate: string;
  status: "Active" | "Inactive";
}

function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([
    { id: 1, name: "Ali Khan", email: "ali@example.com", phone: "0300-1111111", orders: 24, totalSpent: 580, joinDate: "12 Jan 2024", status: "Active" },
    { id: 2, name: "Sara Ahmed", email: "sara@example.com", phone: "0300-2222222", orders: 18, totalSpent: 420, joinDate: "05 Mar 2024", status: "Active" },
    { id: 3, name: "Usman Ali", email: "usman@example.com", phone: "0300-3333333", orders: 7, totalSpent: 195, joinDate: "20 Apr 2024", status: "Inactive" },
    { id: 4, name: "Fatima Noor", email: "fatima@example.com", phone: "0300-4444444", orders: 31, totalSpent: 870, joinDate: "02 Feb 2024", status: "Active" },
    { id: 5, name: "Hassan Raza", email: "hassan@example.com", phone: "0300-5555555", orders: 12, totalSpent: 310, joinDate: "15 Jun 2024", status: "Active" },
    { id: 6, name: "Ayesha Malik", email: "ayesha@example.com", phone: "0300-6666666", orders: 3, totalSpent: 85, joinDate: "10 Aug 2024", status: "Inactive" },
  ]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);
    const matchesFilter = filter === "All" || c.status === filter;
    return matchesSearch && matchesFilter;
  });

  const toggleStatus = (id: number) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: c.status === "Active" ? "Inactive" : "Active" } : c
      )
    );
  };

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.status === "Active").length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);

  return (
    <>
      <Row className="mb-4">
        <Col md={3}>
          <Card className="shadow border-0 text-center">
            <Card.Body>
              <h6 className="text-muted">Total Customers</h6>
              <h2>{totalCustomers}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow border-0 text-center">
            <Card.Body>
              <h6 className="text-muted">Active</h6>
              <h2 className="text-success">{activeCustomers}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow border-0 text-center">
            <Card.Body>
              <h6 className="text-muted">Inactive</h6>
              <h2 className="text-danger">{totalCustomers - activeCustomers}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow border-0 text-center">
            <Card.Body>
              <h6 className="text-muted">Total Revenue</h6>
              <h2 className="text-warning">${totalRevenue.toLocaleString()}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow border-0 rounded-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3>Customer Management</h3>
            <div className="d-flex gap-2">
              <Form.Control
                placeholder="Search customers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: "250px" }}
              />
              <Form.Select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ width: "130px" }}>
                <option>All</option>
                <option>Active</option>
                <option>Inactive</option>
              </Form.Select>
            </div>
          </div>

          <Table hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-4 text-muted">No customers found</td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td><strong>{c.name}</strong></td>
                    <td>{c.email}</td>
                    <td>{c.phone}</td>
                    <td>{c.orders}</td>
                    <td>${c.totalSpent}</td>
                    <td>{c.joinDate}</td>
                    <td>
                      <Badge bg={c.status === "Active" ? "success" : "secondary"}>
                        {c.status}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        size="sm"
                        variant={c.status === "Active" ? "warning" : "success"}
                        onClick={() => toggleStatus(c.id)}
                      >
                        {c.status === "Active" ? "Deactivate" : "Activate"}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </>
  );
}

export default Customers;

