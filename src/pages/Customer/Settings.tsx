import { useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { FaBell, FaLock, FaGlobe, FaSave } from "react-icons/fa";

interface CustomerSettings {
  language: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

function Settings() {
  const [settings, setSettings] = useState<CustomerSettings>({
    language: "English",
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [saved, setSaved] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleChange = (field: string, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const savePreferences = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const changePassword = () => {
    if (settings.newPassword !== settings.confirmPassword) {
      setPasswordError("Passwords do not match!");
      return;
    }
    if (settings.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters!");
      return;
    }
    setPasswordError("");
    alert("Password changed successfully!");
    setSettings((prev) => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
  };

  return (
    <Row>
      <Col lg={8}>
        {saved && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            Preferences saved successfully!
            <button type="button" className="btn-close" onClick={() => setSaved(false)} />
          </div>
        )}

        <Card className="shadow border-0 rounded-4 mb-4">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0"><FaGlobe className="me-2" /> Preferences</h5>
              <Button variant="warning" size="sm" onClick={savePreferences}>
                <FaSave className="me-1" /> Save
              </Button>
            </div>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Language</Form.Label>
                  <Form.Select value={settings.language} onChange={(e) => handleChange("language", e.target.value)}>
                    <option>English</option>
                    <option>Urdu</option>
                    <option>Arabic</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card className="shadow border-0 rounded-4 mb-4">
          <Card.Body>
            <h5 className="mb-4"><FaBell className="me-2" /> Notification Settings</h5>
            <Form.Check
              type="switch"
              label="Email Notifications (order updates, offers)"
              checked={settings.emailNotifications}
              onChange={(e) => handleChange("emailNotifications", e.target.checked)}
              className="mb-3"
            />
            <Form.Check
              type="switch"
              label="SMS Notifications"
              checked={settings.smsNotifications}
              onChange={(e) => handleChange("smsNotifications", e.target.checked)}
              className="mb-3"
            />
            <Form.Check
              type="switch"
              label="Push Notifications"
              checked={settings.pushNotifications}
              onChange={(e) => handleChange("pushNotifications", e.target.checked)}
            />
          </Card.Body>
        </Card>

        <Card className="shadow border-0 rounded-4">
          <Card.Body>
            <h5 className="mb-4"><FaLock className="me-2" /> Change Password</h5>

            {passwordError && (
              <div className="alert alert-danger py-2">{passwordError}</div>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                value={settings.currentPassword}
                onChange={(e) => handleChange("currentPassword", e.target.value)}
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={settings.newPassword}
                    onChange={(e) => handleChange("newPassword", e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={settings.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="warning" onClick={changePassword}>
              Change Password
            </Button>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default Settings;

