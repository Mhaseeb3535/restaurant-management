import { useEffect, useState, useCallback } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import api from "../../../services/api";

interface StaffMember {
  id: number;
  user_id: number | null;
  name: string;
  email: string;
  phone: string;
  role: string;
  shift: string;
  salary: number | string;
  status: "Active" | "Inactive" | "On Leave";
}

const emptyForm = {
  name: "",
  email: "",
  password: "",
  phone: "",
  role: "",
  shift: "Morning",
  salary: 0,
  status: "Active" as StaffMember["status"],
};

function getApiErrorMessage(error: unknown, fallback: string) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: unknown }).response === "object" &&
    (error as { response: { data?: unknown } }).response !== null &&
    "data" in (error as { response: { data?: unknown } }).response &&
    typeof (error as { response: { data?: { error?: unknown } } }).response.data?.error ===
      "string"
  ) {
    return (error as { response: { data: { error: string } } }).response.data.error;
  }

  return error instanceof Error ? error.message : fallback;
}

function Staff() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [formData, setFormData] = useState<typeof emptyForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const refreshStaff = useCallback(async () => {
    try {
      const res = await api.get("/staff");
      setStaff(res.data);
      setError("");
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Failed to load staff"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    api
      .get("/staff")
      .then((res) => {
        if (active) {
          setStaff(res.data);
          setError("");
        }
      })
      .catch((err: unknown) => {
        if (active) {
          setError(getApiErrorMessage(err, "Failed to load staff"));
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const openAddModal = () => {
    setEditingStaff(null);
    setFormData(emptyForm);
    setFormError("");
    setShowModal(true);
  };

  const openEditModal = (member: StaffMember) => {
    setEditingStaff(member);
    setFormData({
      name: member.name,
      email: member.email,
      password: "",
      phone: member.phone || "",
      role: member.role,
      shift: member.shift,
      salary: Number(member.salary) || 0,
      status: member.status,
    });
    setFormError("");
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setFormError("");
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.role.trim()) {
      setFormError("Name, email, and role are required");
      return;
    }

    // Password is only required when adding a new staff member
    if (!editingStaff && (!formData.password || formData.password.length < 4)) {
      setFormError("Password must be at least 4 characters");
      return;
    }

    try {
      setSaving(true);
      setFormError("");

      if (editingStaff) {
        const payload: Record<string, unknown> = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          shift: formData.shift,
          salary: formData.salary,
          status: formData.status,
        };
        await api.put(`/staff/${editingStaff.id}`, payload);
      } else {
        await api.post("/staff", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          role: formData.role,
          shift: formData.shift,
          salary: formData.salary,
          status: formData.status,
        });
      }

      await refreshStaff();
      handleClose();
    } catch (err: unknown) {
      setFormError(getApiErrorMessage(err, "Failed to save staff member"));
    } finally {
      setSaving(false);
    }
  };

  const deleteStaff = async (member: StaffMember) => {
    if (window.confirm(`Are you sure you want to remove ${member.name}?`)) {
      try {
        await api.delete(`/staff/${member.id}`);
        await refreshStaff();
      } catch (err: unknown) {
        setError(getApiErrorMessage(err, "Failed to delete staff member"));
      }
    }
  };

  const filteredStaff = staff.filter((s) => {
    const query = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(query) ||
      s.email.toLowerCase().includes(query) ||
      s.role.toLowerCase().includes(query) ||
      s.phone.toLowerCase().includes(query)
    );
  });

  return (
    <>
      <Row className="mb-4">
        <Col md={6}>
          <h2>Restaurant Staff</h2>
        </Col>
        <Col md={6}>
          <Form.Control
            placeholder="Search Staff..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <Card className="shadow rounded-4 border-0">
        <Card.Body>
          <div className="d-flex justify-content-between mb-3">
            <h4>Staff Members</h4>
            <Button variant="warning" onClick={openAddModal}>
              Add New Staff
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="warning" />
            </div>
          ) : (
            <Table hover responsive bordered>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Phone</th>
                  <th>Shift</th>
                  <th>Salary</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-4 text-muted">
                      No staff found
                    </td>
                  </tr>
                ) : (
                  filteredStaff.map((employee) => (
                    <tr key={employee.id}>
                      <td>{employee.id}</td>
                      <td>{employee.name}</td>
                      <td>{employee.email}</td>
                      <td>{employee.role}</td>
                      <td>{employee.phone}</td>
                      <td>{employee.shift}</td>
                      <td>${Number(employee.salary).toLocaleString()}</td>
                      <td>
                        <Badge
                          bg={
                            employee.status === "Active"
                              ? "success"
                              : employee.status === "On Leave"
                              ? "warning"
                              : "secondary"
                          }
                        >
                          {employee.status}
                        </Badge>
                      </td>
                      <td>
                        <Button
                          size="sm"
                          variant="primary"
                          className="me-2"
                          onClick={() => openEditModal(employee)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => deleteStaff(employee)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingStaff ? "Edit Staff" : "Add New Staff"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formError && (
            <Alert variant="danger" className="py-2">
              {formError}
            </Alert>
          )}

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name *</Form.Label>
                <Form.Control
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Role *</Form.Label>
                <Form.Select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="">Select Role</option>
                  <option>Head Chef</option>
                  <option>Chef</option>
                  <option>Waiter</option>
                  <option>Cashier</option>
                  <option>Manager</option>
                  <option>Cleaner</option>
                  <option>Receptionist</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email (Login) *</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="staff@restaurant.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>{editingStaff ? "New Password (optional)" : "Password (Login) *"}</Form.Label>
                <Form.Control
                  type="password"
                  placeholder={editingStaff ? "Leave blank to keep current" : "Min 4 characters"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Shift</Form.Label>
                <Form.Select
                  value={formData.shift}
                  onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                >
                  <option>Morning</option>
                  <option>Evening</option>
                  <option>Night</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Salary ($)</Form.Label>
                <Form.Control
                  type="number"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as StaffMember["status"] })
                  }
                >
                  <option>Active</option>
                  <option>Inactive</option>
                  <option>On Leave</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="warning" onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Spinner as="span" animation="border" size="sm" className="me-2" />
                Saving...
              </>
            ) : editingStaff ? (
              "Update Staff"
            ) : (
              "Add Staff"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Staff;