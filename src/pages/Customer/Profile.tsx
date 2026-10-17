import { useState, useEffect } from "react";
import { Button, Card, Col, Form, Row, Spinner } from "react-bootstrap";
import { FaUser, FaSave, FaLock } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

interface ProfileForm {
  name: string;
  email: string;
  phone: string;
}

function Profile() {
  const { user, loading, updateUser, changePassword } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileForm>({ name: "", email: "", phone: "" });
  const [saved, setSaved] = useState(false);

  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleChange = (field: keyof ProfileForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const res = await api.put("/auth/me", formData);
      updateUser(res.data.user);
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({ name: user.name, email: user.email, phone: user.phone || "" });
    }
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

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" variant="warning" />
        <p>Loading Profile...</p>
      </div>
    );
  }

  if (!user) {
    return <p className="text-center">Please log in to view your profile.</p>;
  }

  return (
    <Row className="justify-content-center">
      <Col lg={8}>
        {saved && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            Profile updated successfully!
            <button type="button" className="btn-close" onClick={() => setSaved(false)} />
          </div>
        )}

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
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="d-flex align-items-center gap-3">
                <div className="bg-warning rounded-circle p-3">
                  <FaUser size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="mb-0">{user.name}</h3>
                  <small className="text-muted">Customer</small>
                </div>
              </div>
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
            <hr />

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Full Name</Form.Label>
                  {editing ? (
                    <Form.Control value={formData.name} onChange={(e) => handleChange("name", e.target.value)} />
                  ) : (
                    <p className="text-muted">{user.name}</p>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Email</Form.Label>
                  {editing ? (
                    <Form.Control type="email" value={formData.email} readOnly />
                  ) : (
                    <p className="text-muted">{user.email}</p>
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
                    <p className="text-muted">{user.phone || "Not provided"}</p>
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

