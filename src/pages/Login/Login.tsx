import { useState } from "react";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaArrowLeft } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const { user } = await login(email, password);
      if (user.role === "admin") navigate("/admin");
      else if (user.role === "staff") navigate("/staff");
      else if (user.role === "superadmin") navigate("/super-admin");
      else navigate("/customer");
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    alert("Google authentication will be integrated soon!");
  };

  return (
    <div className="login-page">
      <div className="login-page-bg"></div>
      <Container className="login-container">
        <motion.div
          className="login-card-wrapper"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="login-card">
            <button className="login-back-btn" onClick={() => navigate("/")}>
              <FaArrowLeft />
            </button>

            <div className="login-header">
              <motion.img
                src="/icon.png"
                alt="Diego Kitchen"
                className="login-logo"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              />
              <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                Welcome Back
              </motion.h2>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                Sign in to Diego Kitchen Restaurant
              </motion.p>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              {error && <Alert variant="danger" className="login-alert">{error}</Alert>}

              <Form onSubmit={handleLogin}>
                <div className="login-input-group">
                  <FaEnvelope className="login-input-icon" />
                  <Form.Control type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="login-input" disabled={loading} />
                </div>

                <div className="login-input-group">
                  <FaLock className="login-input-icon" />
                  <Form.Control type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="login-input" disabled={loading} />
                  <span className="login-password-toggle" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>

                <div className="login-options">
                  <label className="login-checkbox">
                    <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                    <span>Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="login-forgot-link">Forgot Password?</Link>
                </div>

                <Button variant="warning" type="submit" className="login-submit-btn" disabled={loading}>
                  {loading ? <><Spinner size="sm" className="me-2" />Signing in...</> : "Sign In"}
                </Button>
              </Form>

              <div className="login-divider">
                <span>or continue with</span>
              </div>

              <Button variant="outline-light" className="login-google-btn" onClick={handleGoogleLogin} disabled={loading}>
                <FaGoogle className="me-2" /> Continue with Google
              </Button>

              <p className="login-switch-text">
                Don't have an account? <Link to="/register" className="login-switch-link">Register Now</Link>
              </p>

              <div className="login-demo">
          
              </div>
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </div>
  );
}

export default Login;
