import { useState } from "react";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash, FaGoogle, FaArrowLeft } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate("/login");
      }, 2000);
    } catch (err) {
      setLoading(false);
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || "Registration failed. Please try again.");
    }
  };

  const handleGoogleRegister = () => {
    alert("Google authentication will be integrated soon!");
  };

  return (
    <div className="register-page">
      <div className="register-page-bg"></div>
      <Container className="register-container">
        <motion.div
          className="register-card-wrapper"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="register-card">
            <button className="register-back-btn" onClick={() => navigate("/")}>
              <FaArrowLeft />
            </button>

            <div className="register-header">
              <motion.img
                src="/icon.png"
                alt="Diego Kitchen"
                className="register-logo"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              />
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                Create Account
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Join Diego Kitchen Restaurant
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {success && (
                <Alert variant="success" className="register-alert register-alert-success">
                  Account created successfully! Redirecting to login...
                </Alert>
              )}

              {error && <Alert variant="danger" className="register-alert">{error}</Alert>}

              <Form onSubmit={handleRegister}>
                <div className="register-input-group">
                  <FaUser className="register-input-icon" />
                  <Form.Control
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="register-input"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="register-input-group">
                  <FaEnvelope className="register-input-icon" />
                  <Form.Control
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="register-input"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="register-input-group">
                  <FaLock className="register-input-icon" />
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="register-input"
                    required
                    disabled={loading}
                  />
                  <span className="register-password-toggle" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>

                <div className="register-input-group">
                  <FaLock className="register-input-icon" />
                  <Form.Control
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="register-input"
                    required
                    disabled={loading}
                  />
                  <span className="register-password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>

                <Button variant="warning" type="submit" className="register-submit-btn" disabled={loading}>
                  {loading ? <><Spinner size="sm" className="me-2" />Creating account...</> : "Create Account"}
                </Button>
              </Form>

              <div className="register-divider">
                <span>or continue with</span>
              </div>

              <Button variant="outline-light" className="register-google-btn" onClick={handleGoogleRegister} disabled={loading}>
                <FaGoogle className="me-2" />
                Continue with Google
              </Button>

              <p className="register-switch-text">
                Already have an account?{" "}
                <Link to="/login" className="register-switch-link">Sign In</Link>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </div>
  );
}

export default Register;
