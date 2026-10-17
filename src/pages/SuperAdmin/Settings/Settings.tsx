import { useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { FaSave, FaGlobe, FaLock, FaBell, FaPalette } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";

function Settings() {
  const { changePassword } = useAuth();
  const [settings, setSettings] = useState({
    appName: "Royal Restaurant Management",
    appUrl: "https://royalrestaurant.com",
    supportEmail: "support@royalrestaurant.com",
    maxRestaurants: "5",
    sessionTimeout: "60",
    enableNotifications: true,
    enableAutoBackup: true,
    enableRegistration: false,
    maintenanceMode: false,
    themeColor: "#ffc107",
    language: "English",
    dateFormat: "DD/MM/YYYY",
    timezone: "Asia/Karachi",
  });

  const [saved, setSaved] = useState(false);

  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const handleChange = (field: string, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>System Settings</h2>
        <Button variant="warning" onClick={handleSave}>
          <FaSave className="me-2" />{saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      {saved && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          System settings updated successfully!
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

      <Row>
        <Col lg={8}>
          <Card className="shadow border-0 rounded-4 mb-4">
            <Card.Body>
              <h5 className="mb-4"><FaGlobe className="me-2" /> General Settings</h5>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Application Name</Form.Label>
                    <Form.Control value={settings.appName} onChange={(e) => handleChange("appName", e.target.value)} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Application URL</Form.Label>
                    <Form.Control value={settings.appUrl} onChange={(e) => handleChange("appUrl", e.target.value)} />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Support Email</Form.Label>
                    <Form.Control type="email" value={settings.supportEmail} onChange={(e) => handleChange("supportEmail", e.target.value)} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Max Restaurants</Form.Label>
                    <Form.Control type="number" value={settings.maxRestaurants} onChange={(e) => handleChange("maxRestaurants", e.target.value)} />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="shadow border-0 rounded-4 mb-4">
            <Card.Body>
              <h5 className="mb-4"><FaPalette className="me-2" /> Display Settings</h5>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Theme Color</Form.Label>
                    <Form.Control type="color" value={settings.themeColor} onChange={(e) => handleChange("themeColor", e.target.value)} />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Language</Form.Label>
                    <Form.Select value={settings.language} onChange={(e) => handleChange("language", e.target.value)}>
                      <option>English</option>
                      <option>Urdu</option>
                      <option>Arabic</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date Format</Form.Label>
                    <Form.Select value={settings.dateFormat} onChange={(e) => handleChange("dateFormat", e.target.value)}>
                      <option>DD/MM/YYYY</option>
                      <option>MM/DD/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Timezone</Form.Label>
                    <Form.Select value={settings.timezone} onChange={(e) => handleChange("timezone", e.target.value)}>
                      <option>Asia/Karachi</option>
                      <option>Asia/Dubai</option>
                      <option>Asia/Riyadh</option>
                      <option>UTC</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="shadow border-0 rounded-4 mb-4">
            <Card.Body>
              <h5 className="mb-4"><FaLock className="me-2" /> Security</h5>
              <Form.Group className="mb-3">
                <Form.Label>Session Timeout (minutes)</Form.Label>
                <Form.Control type="number" value={settings.sessionTimeout} onChange={(e) => handleChange("sessionTimeout", e.target.value)} />
              </Form.Group>
              <Form.Check
                type="switch"
                label="Enable Public Registration"
                checked={settings.enableRegistration}
                onChange={(e) => handleChange("enableRegistration", e.target.checked)}
                className="mb-3"
              />
              <Form.Check
                type="switch"
                label="Maintenance Mode"
                checked={settings.maintenanceMode}
                onChange={(e) => handleChange("maintenanceMode", e.target.checked)}
              />
            </Card.Body>
          </Card>

          <Card className="shadow border-0 rounded-4 mb-4">
            <Card.Body>
              <h5 className="mb-4"><FaBell className="me-2" /> Notifications & Backup</h5>
              <Form.Check
                type="switch"
                label="Enable Email Notifications"
                checked={settings.enableNotifications}
                onChange={(e) => handleChange("enableNotifications", e.target.checked)}
                className="mb-3"
              />
              <Form.Check
                type="switch"
                label="Auto Backup Enabled"
                checked={settings.enableAutoBackup}
                onChange={(e) => handleChange("enableAutoBackup", e.target.checked)}
              />
              <hr />
              <small className="text-muted d-block">Backups are stored daily at 2:00 AM</small>
              <small className="text-muted d-block">Retention period: 30 days</small>
            </Card.Body>
          </Card>

          {/* Change Password Card */}
          <Card className="shadow border-0 rounded-4">
            <Card.Body>
              <h5 className="mb-4"><FaLock className="me-2" /> Change Password</h5>
              {!showPasswordForm ? (
                <Button variant="outline-warning" size="sm" onClick={() => setShowPasswordForm(true)}>
                  Change Password
                </Button>
              ) : (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Current Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                    />
                  </Form.Group>
                  <div className="d-flex gap-2">
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={handleChangePassword}
                      disabled={changingPassword}
                    >
                      {changingPassword ? "Changing..." : "Update Password"}
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
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
    </>
  );
}

export default Settings;
