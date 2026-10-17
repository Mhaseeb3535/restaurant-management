import { useState } from "react";
import { Badge, Button, Card, Col, Form, Modal, Row, Table } from "react-bootstrap";

interface StaffMember {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  restaurant: string;
  shift: string;
  salary: number;
  status: "Active" | "Inactive" | "On Leave";
}

function Staff() {
  const [staff, setStaff] = useState<StaffMember[]>([
    { id: 1, name: "Ali Khan", email: "ali@royal.com", phone: "0300-1111111", role: "Head Chef", restaurant: "Royal Restaurant", shift: "Morning", salary: 2500, status: "Active" },
    { id: 2, name: "Ahmed Raza", email: "ahmed@royal.com", phone: "0300-2222222", role: "Waiter", restaurant: "Royal Restaurant", shift: "Evening", salary: 1200, status: "Active" },
    { id: 3, name: "Sara Ali", email: "sara@royal.com", phone: "0300-3333333", role: "Cashier", restaurant: "Royal Restaurant", shift: "Morning", salary: 1400, status: "On Leave" },
    { id: 4, name: "Usman Khan", email: "usman@royal.com", phone: "0300-4444444", role: "Chef", restaurant: "Royal Restaurant", shift: "Night", salary: 1800, status: "Active" },
    { id: 5, name: "Fatima Noor", email: "fatima@royal.com", phone: "0300-5555555", role: "Manager", restaurant: "Royal Restaurant", shift: "Morning", salary: 3000, status: "Inactive" },
    { id: 6, name: "Hassan Ali", email: "hassan@royal.com", phone: "0300-6666666", role: "Waiter", restaurant: "Royal Restaurant", shift: "Morning", salary: 1100, status: "Active" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [formData, setFormData] = useState<Partial<StaffMember>>({});

  const openAddModal = () => {
    setEditingStaff(null);
    setFormData({ name: "", email: "", phone: "", role: "", restaurant: "Royal Restaurant", shift: "Morning", salary: 0, status: "Active" });
    setShowModal(true);
  };

  const openEditModal = (member: StaffMember) => {
    setEditingStaff(member);
    setFormData({ ...member });
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingStaff) {
      setStaff((prev) => prev.map((s) => (s.id === editingStaff.id ? { ...s, ...formData } as StaffMember : s)));
    } else {
      const newId = Math.max(...staff.map((s) => s.id), 0) + 1;
      setStaff((prev) => [...prev, { id: newId, ...formData } as StaffMember]);
    }
    setShowModal(false);
  };

  const deleteStaff = (id: number) => {
    if (window.confirm("Are you sure you want to remove this staff member?")) {
      setStaff((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const activeCount = staff.filter((s) => s.status === "Active").length;
  const totalSalary = staff.reduce((sum, s) => sum + s.salary, 0);

  return (
    <>
      <Row className="mb-4">
        <Col md={3}>
          <Card className="shadow border-0 text-center">
            <Card.Body>
              <h6 className="text-muted">Total Staff</h6>
              <h2>{staff.length}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow border-0 text-center">
            <Card.Body>
              <h6 className="text-muted">Active</h6>
              <h2 className="text-success">{activeCount}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow border-0 text-center">
            <Card.Body>
              <h6 className="text-muted">On Leave / Inactive</h6>
              <h2 className="text-warning">{staff.length - activeCount}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow border-0 text-center">
            <Card.Body>
              <h6 className="text-muted">Monthly Payroll</h6>
              <h2 className="text-danger">${totalSalary.toLocaleString()}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow border-0 rounded-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3>All Staff Members</h3>
            <Button variant="warning" onClick={openAddModal}>+ Add Staff</Button>
          </div>

          <Table hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Shift</th>
                <th>Salary</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((member) => (
                <tr key={member.id}>
                  <td>{member.id}</td>
                  <td><strong>{member.name}</strong></td>
                  <td>{member.email}</td>
                  <td>{member.phone}</td>
                  <td>{member.role}</td>
                  <td>{member.shift}</td>
                  <td>${member.salary}</td>
                  <td>
                    <Badge bg={member.status === "Active" ? "success" : member.status === "On Leave" ? "warning" : "secondary"}>
                      {member.status}
                    </Badge>
                  </td>
                  <td>
                    <Button size="sm" variant="primary" className="me-2" onClick={() => openEditModal(member)}>Edit</Button>
                    <Button size="sm" variant="danger" onClick={() => deleteStaff(member.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingStaff ? "Edit Staff" : "Add New Staff"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" value={formData.email || ""} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control value={formData.phone || ""} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Select value={formData.role || ""} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                  <option value="">Select Role</option>
                  <option>Head Chef</option>
                  <option>Chef</option>
                  <option>Waiter</option>
                  <option>Cashier</option>
                  <option>Manager</option>
                  <option>Cleaner</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Shift</Form.Label>
                <Form.Select value={formData.shift || ""} onChange={(e) => setFormData({ ...formData, shift: e.target.value })}>
                  <option>Morning</option>
                  <option>Evening</option>
                  <option>Night</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Salary ($)</Form.Label>
                <Form.Control type="number" value={formData.salary || 0} onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })} />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select value={formData.status || "Active"} onChange={(e) => setFormData({ ...formData, status: e.target.value as StaffMember["status"] })}>
              <option>Active</option>
              <option>Inactive</option>
              <option>On Leave</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="warning" onClick={handleSave}>{editingStaff ? "Update" : "Add Staff"}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Staff;

