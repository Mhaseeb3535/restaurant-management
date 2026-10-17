import { useState } from "react";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import "./ForgotPassword.css";

function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    setError("");
    setLoading(true);
    setMessage("");
    try {
      await forgotPassword(email);
      setMessage("A verification code has been sent to your email address.");
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-page-bg"></div>
      <Container className="forgot-password-container">
        <motion.div
          className="forgot-password-card-wrapper"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="forgot-password-card">
            <Link to="/login" className="forgot-password-back-btn">
              <FaArrowLeft />
            </Link>

            <div className="forgot-password-header">
              <motion.img
                src="/icon.png"
                alt="Diego Kitchen"
                className="forgot-password-logo"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              />
              <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                Forgot Password
              </motion.h2>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                Enter your email to receive a verification code.
              </motion.p>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              {error && <Alert variant="danger" className="forgot-password-alert">{error}</Alert>}
              {message && <Alert variant="success" className="forgot-password-alert">{message}</Alert>}

              <Form onSubmit={handleForgotPassword}>
                <div className="forgot-password-input-group">
                  <FaEnvelope className="forgot-password-input-icon" />
                  <Form.Control
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="forgot-password-input"
                    disabled={loading}
                  />
                </div>

                <Button variant="warning" type="submit" className="forgot-password-submit-btn" disabled={loading}>
                  {loading ? <><Spinner size="sm" className="me-2" />Sending...</> : "Send Verification Code"}
                </Button>
              </Form>
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </div>
  );
}

export default ForgotPassword;
