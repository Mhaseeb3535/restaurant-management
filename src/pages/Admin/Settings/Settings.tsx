import { useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { FaSave, FaUtensils, FaClock, FaPhone, FaMapMarkerAlt, FaEnvelope, FaLock } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";

function Settings() {
  const { changePassword } = useAuth();
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: "Royal Restaurant",
    tagline: "Taste the Royalty",
    phone: "+92-300-1234567",
    email: "info@royalrestaurant.com",
    address: "123 Food Street, Gourmet City, Lahore",
    openingTime: "9:00 AM",
    closingTime: "11:00 PM",
    cuisine: "Continental, Asian, Fast Food",
    taxRate: "13",
    deliveryFee: "5",
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

  const handleChange = (field: string, value: string) => {
    setRestaurantInfo((prev) => ({ ...prev, [field]: value }));
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
        <h2>Restaurant Settings</h2>
        <Button variant="warning" onClick={handleSave}>
          <FaSave className="me-2" />{saved ? "Saved!" : "Save Settings"}
        </Button>
      </div>

      {saved && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          Settings saved successfully!
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
              <h5 className="mb-4"><FaUtensils className="me-2" /> Restaurant Information</h5>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Restaurant Name</Form.Label>
                    <Form.Control value={restaurantInfo.name} onChange={(e) => handleChange("name", e.target.value)} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tagline</Form.Label>
                    <Form.Control value={restaurantInfo.tagline} onChange={(e) => handleChange("tagline", e.target.value)} />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label><FaPhone className="me-1" /> Phone</Form.Label>
                    <Form.Control value={restaurantInfo.phone} onChange={(e) => handleChange("phone", e.target.value)} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label><FaEnvelope className="me-1" /> Email</Form.Label>
                    <Form.Control type="email" value={restaurantInfo.email} onChange={(e) => handleChange("email", e.target.value)} />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label><FaMapMarkerAlt className="me-1" /> Address</Form.Label>
                <Form.Control as="textarea" rows={2} value={restaurantInfo.address} onChange={(e) => handleChange("address", e.target.value)} />
              </Form.Group>
            </Card.Body>
          </Card>

          <Card className="shadow border-0 rounded-4 mb-4">
            <Card.Body>
              <h5 className="mb-4"><FaClock className="me-2" /> Operating Hours</h5>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Opening Time</Form.Label>
                    <Form.Control type="time" value={restaurantInfo.openingTime} onChange={(e) => handleChange("openingTime", e.target.value)} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Closing Time</Form.Label>
                    <Form.Control type="time" value={restaurantInfo.closingTime} onChange={(e) => handleChange("closingTime", e.target.value)} />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="shadow border-0 rounded-4 mb-4">
            <Card.Body>
              <h5 className="mb-4">Pricing</h5>
              <Form.Group className="mb-3">
                <Form.Label>Tax Rate (%)</Form.Label>
                <Form.Control type="number" value={restaurantInfo.taxRate} onChange={(e) => handleChange("taxRate", e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Delivery Fee ($)</Form.Label>
                <Form.Control type="number" value={restaurantInfo.deliveryFee} onChange={(e) => handleChange("deliveryFee", e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Cuisine Type</Form.Label>
                <Form.Control value={restaurantInfo.cuisine} onChange={(e) => handleChange("cuisine", e.target.value)} />
              </Form.Group>
            </Card.Body>
          </Card>

          <Card className="shadow border-0 rounded-4">
            <Card.Body>
              <h5 className="mb-3">Quick Preview</h5>
              <h4 className="text-warning">{restaurantInfo.name}</h4>
              <p className="text-muted"><em>"{restaurantInfo.tagline}"</em></p>
              <hr />
              <small className="text-muted d-block">{restaurantInfo.address}</small>
              <small className="text-muted d-block">{restaurantInfo.phone}</small>
              <small className="text-muted d-block">{restaurantInfo.email}</small>
              <small className="text-muted d-block">Hours: {restaurantInfo.openingTime} - {restaurantInfo.closingTime}</small>
            </Card.Body>
          </Card>

          {/* Change Password Card */}
          <Card className="shadow border-0 rounded-4 mt-4">
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
