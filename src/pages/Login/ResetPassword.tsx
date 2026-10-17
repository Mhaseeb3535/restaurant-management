import { useState } from "react";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FaLock, FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import "./ResetPassword.css";

function ResetPassword() {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const location = useLocation();
  const email = new URLSearchParams(location.search).get("email");

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!email) {
      setError("Email not found.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await resetPassword(email, code, password);
      navigate("/login");
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-page">
      <div className="reset-password-page-bg"></div>
      <Container className="reset-password-container">
        <motion.div
          className="reset-password-card-wrapper"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="reset-password-card">
            <button className="reset-password-back-btn" onClick={() => navigate("/login")}>
              <FaArrowLeft />
            </button>

            <div className="reset-password-header">
              <motion.img
                src="/icon.png"
                alt="Diego Kitchen"
                className="reset-password-logo"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              />
              <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                Reset Password
              </motion.h2>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                Enter the verification code and your new password.
              </motion.p>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              {error && <Alert variant="danger" className="reset-password-alert">{error}</Alert>}

              <Form onSubmit={handleResetPassword}>
                <div className="reset-password-input-group">
                  <FaLock className="reset-password-input-icon" />
                  <Form.Control
                    type="text"
                    placeholder="Verification Code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="reset-password-input"
                    disabled={loading}
                  />
                </div>

                <div className="reset-password-input-group">
                  <FaLock className="reset-password-input-icon" />
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="reset-password-input"
                    disabled={loading}
                  />
                  <span className="reset-password-password-toggle" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>

                <div className="reset-password-input-group">
                  <FaLock className="reset-password-input-icon" />
                  <Form.Control
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="reset-password-input"
                    disabled={loading}
                  />
                  <span className="reset-password-password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>

                <Button variant="warning" type="submit" className="reset-password-submit-btn" disabled={loading}>
                  {loading ? <><Spinner size="sm" className="me-2" />Resetting...</> : "Reset Password"}
                </Button>
              </Form>
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </div>
  );
}

export default ResetPassword;
