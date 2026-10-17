import { useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { FaUser, FaLock, FaSave } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";

interface StaffProfile {
  name: string;
  email: string;
  phone: string;
  role: string;
  shift: string;
  joinDate: string;
  address: string;
  emergencyContact: string;
}

function Profile() {
  const { changePassword } = useAuth();
  const [profile, setProfile] = useState<StaffProfile>({
    name: "Ahmed Khan",
    email: "ahmed.khan@royalrestaurant.com",
    phone: "0300-1234567",
    role: "Head Chef",
    shift: "Morning (6AM - 2PM)",
    joinDate: "15 Jan 2024",
    address: "123 Street, Garden Town, Lahore",
    emergencyContact: "0300-9876543 (Brother)",
  });

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<StaffProfile>({ ...profile });

  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const handleChange = (field: keyof StaffProfile, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setProfile({ ...formData });
    setEditing(false);
  };

  const handleCancel = () => {
    setFormData({ ...profile });
    setEditing(false);
  };

  const handleChangePassword = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All password fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (newPassword.length < 4) {
      setPasswordError("Password must be at least 4 characters");
      return;
    }

    setChangingPassword(true);
    try {
      await changePassword(currentPassword, newPassword);
      setPasswordSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordForm(false);
      setTimeout(() => setPasswordSuccess(""), 3000);
    } catch (error) {
      const err = error as any;
      setPasswordError(err.response?.data?.error || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <Row className="justify-content-center">
      <Col lg={8}>
        {passwordSuccess && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            {passwordSuccess}
            <button type="button" className="btn-close" onClick={() => setPasswordSuccess("")} />
          </div>
        )}

        {passwordError && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {passwordError}
            <button type="button" className="btn-close" onClick={() => setPasswordError("")} />
          </div>
        )}

        {/* Profile Information Card */}
        <Card className="shadow border-0 rounded-4 mb-4">
          <Card.Body className="p-4">
            <div className="d-flex align-items-center gap-3 mb-4">
              <div className="bg-warning rounded-circle p-3">
                <FaUser size={24} className="text-white" />
              </div>
              <div>
                <h3 className="mb-0">{profile.name}</h3>
                <small className="text-muted">{profile.role}</small>
              </div>
              <div className="ms-auto">
                {!editing ? (
                  <Button variant="warning" onClick={() => setEditing(true)}>
                    Edit Profile
                  </Button>
                ) : (
                  <div className="d-flex gap-2">
                    <Button variant="success" onClick={handleSave}>
                      <FaSave className="me-1" /> Save
                    </Button>
                    <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
                  </div>
                )}
              </div>
            </div>

            <hr />

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Full Name</Form.Label>
                  {editing ? (
                    <Form.Control value={formData.name} onChange={(e) => handleChange("name", e.target.value)} />
                  ) : (
                    <p className="text-muted">{profile.name}</p>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Email</Form.Label>
                  {editing ? (
                    <Form.Control type="email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} />
                  ) : (
                    <p className="text-muted">{profile.email}</p>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Phone</Form.Label>
                  {editing ? (
                    <Form.Control value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} />
                  ) : (
                    <p className="text-muted">{profile.phone}</p>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Role</Form.Label>
                  {editing ? (
                    <Form.Select value={formData.role} onChange={(e) => handleChange("role", e.target.value)}>
                      <option>Head Chef</option>
                      <option>Chef</option>
                      <option>Waiter</option>
                      <option>Cashier</option>
                      <option>Manager</option>
                    </Form.Select>
                  ) : (
                    <p className="text-muted">{profile.role}</p>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Shift</Form.Label>
                  {editing ? (
                    <Form.Select value={formData.shift} onChange={(e) => handleChange("shift", e.target.value)}>
                      <option>Morning (6AM - 2PM)</option>
                      <option>Evening (2PM - 10PM)</option>
                      <option>Night (10PM - 6AM)</option>
                    </Form.Select>
                  ) : (
                    <p className="text-muted">{profile.shift}</p>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Join Date</Form.Label>
                  <p className="text-muted">{profile.joinDate}</p>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Address</Form.Label>
                  {editing ? (
                    <Form.Control as="textarea" rows={2} value={formData.address} onChange={(e) => handleChange("address", e.target.value)} />
                  ) : (
                    <p className="text-muted">{profile.address}</p>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Emergency Contact</Form.Label>
                  {editing ? (
                    <Form.Control value={formData.emergencyContact} onChange={(e) => handleChange("emergencyContact", e.target.value)} />
                  ) : (
                    <p className="text-muted">{profile.emergencyContact}</p>
                  )}
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Change Password Card */}
        <Card className="shadow border-0 rounded-4">
          <Card.Body className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0"><FaLock className="me-2" /> Change Password</h5>
              {!showPasswordForm && (
                <Button variant="outline-warning" size="sm" onClick={() => setShowPasswordForm(true)}>
                  Change Password
                </Button>
              )}
            </div>

            {showPasswordForm && (
              <>
                <hr />
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Current Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>New Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Confirm New Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <div className="d-flex gap-2">
                  <Button
                    variant="warning"
                    onClick={handleChangePassword}
                    disabled={changingPassword}
                  >
                    {changingPassword ? "Changing..." : "Update Password"}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                      setPasswordError("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default Profile;

