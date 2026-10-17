import { useState } from "react";
import { Modal, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaEnvelope, FaLock, FaUser, FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import "./AuthModal.css";

interface AuthModalProps {
  show: boolean;
  onHide: () => void;
  onSuccess?: () => void;
}

function AuthModal({ show, onHide, onSuccess }: AuthModalProps) {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regError, setRegError] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (!loginEmail || !loginPassword) {
      setLoginError("Please enter email and password.");
      return;
    }

    setLoginLoading(true);
    try {
      const { user } = await login(loginEmail, loginPassword);
      setLoginLoading(false);
      onHide();
      if (onSuccess) onSuccess();
      if (user.role === "admin") navigate("/admin");
      else if (user.role === "staff") navigate("/staff");
      else if (user.role === "superadmin") navigate("/super-admin");
      else navigate("/customer");
    } catch (err) {
      setLoginLoading(false);
      const error = err as { response?: { data?: { error?: string } } };
      setLoginError(error.response?.data?.error || "Invalid email or password. Please try again.");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");

    if (!regName || !regEmail || !regPassword || !regConfirmPassword) {
      setRegError("Please fill in all fields.");
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError("Passwords do not match.");
      return;
    }

    if (regPassword.length < 4) {
      setRegError("Password must be at least 4 characters.");
      return;
    }

    setRegLoading(true);
    try {
      await register(regName, regEmail, regPassword);
      setRegLoading(false);
      setRegSuccess(true);
      setTimeout(() => {
        setRegSuccess(false);
        setActiveTab("login");
        setLoginEmail(regEmail);
        setRegName("");
        setRegEmail("");
        setRegPassword("");
        setRegConfirmPassword("");
      }, 2000);
    } catch (err) {
      setRegLoading(false);
      const error = err as { response?: { data?: { error?: string } } };
      setRegError(error.response?.data?.error || "Registration failed. Please try again.");
    }
  };

  const switchToRegister = () => {
    setActiveTab("register");
    setLoginError("");
  };

  const switchToLogin = () => {
    setActiveTab("login");
    setRegError("");
    setRegSuccess(false);
  };

  const handleClose = () => {
    setActiveTab("login");
    setLoginError("");
    setRegError("");
    setRegSuccess(false);
    setLoginEmail("");
    setLoginPassword("");
    setRegName("");
    setRegEmail("");
    setRegPassword("");
    setRegConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    onHide();
  };

  const handleGoogleLogin = () => {
    alert("Google authentication will be integrated soon!");
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      size="lg"
      className="auth-modal"
      backdropClassName="auth-backdrop"
    >
      <div className="auth-modal-wrapper">
        <div className="auth-modal-bg"></div>
        <div className="auth-modal-content">
          <button className="auth-close-btn" onClick={handleClose}>
            &times;
          </button>

          <div className="auth-header">
            <motion.img
              src="/icon.png"
              alt="Diego Kitchen"
              className="auth-logo"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
            />
            <motion.h2
              className="auth-title"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Diego Kitchen Restaurant
            </motion.h2>
            <motion.p
              className="auth-subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {activeTab === "login" ? "Welcome Back! Sign in to your account" : "Create Your Account"}
            </motion.p>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "login" ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.3 }}
                className="auth-form-container"
              >
                <Form onSubmit={handleLogin}>
                  {loginError && (
                    <Alert variant="danger" className="auth-alert">{loginError}</Alert>
                  )}

                  <Form.Group className="auth-input-group">
                    <FaEnvelope className="auth-input-icon" />
                    <Form.Control type="email" placeholder="Email Address" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="auth-input" disabled={loginLoading} />
                  </Form.Group>

                  <Form.Group className="auth-input-group">
                    <FaLock className="auth-input-icon" />
                    <Form.Control type={showPassword ? "text" : "password"} placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="auth-input" disabled={loginLoading} />
                    <span className="auth-password-toggle" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </Form.Group>

                  <div className="auth-options">
                    <Form.Check type="checkbox" label="Remember me" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="auth-checkbox" />
                    <Link to="/forgot-password" className="auth-forgot-link">Forgot Password?</Link>
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="warning" type="submit" className="auth-submit-btn" disabled={loginLoading}>
                      {loginLoading ? <><Spinner size="sm" className="me-2" />Signing in...</> : "Sign In"}
                    </Button>
                  </motion.div>

                  <div className="auth-divider"><span>or continue with</span></div>

                  <Button variant="outline-light" className="auth-google-btn" onClick={handleGoogleLogin} disabled={loginLoading}>
                    <FaGoogle className="me-2" /> Continue with Google
                  </Button>

                  <p className="auth-switch-text">
                    Don't have an account?{' '}
                    <span className="auth-switch-link" onClick={switchToRegister}>
                      Register Now
                    </span>
                  </p>
                </Form>
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
                className="auth-form-container"
              >
                {regSuccess && (
                  <Alert variant="success" className="auth-alert">
                    Account created successfully! Redirecting to login...
                  </Alert>
                )}

                <Form onSubmit={handleRegister}>
                  {regError && (
                    <Alert variant="danger" className="auth-alert">
                      {regError}
                    </Alert>
                  )}

                  <Form.Group className="auth-input-group">
                    <FaUser className="auth-input-icon" />
                    <Form.Control
                      type="text"
                      placeholder="Full Name"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="auth-input"
                      disabled={regLoading}
                    />
                  </Form.Group>

                  <Form.Group className="auth-input-group">
                    <FaEnvelope className="auth-input-icon" />
                    <Form.Control
                      type="email"
                      placeholder="Email Address"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="auth-input"
                      disabled={regLoading}
                    />
                  </Form.Group>

                  <Form.Group className="auth-input-group">
                    <FaLock className="auth-input-icon" />
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="auth-input"
                      disabled={regLoading}
                    />
                    <span
                      className="auth-password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </Form.Group>

                  <Form.Group className="auth-input-group">
                    <FaLock className="auth-input-icon" />
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      className="auth-input"
                      disabled={regLoading}
                    />
                    <span
                      className="auth-password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </Form.Group>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="warning"
                      type="submit"
                      className="auth-submit-btn"
                      disabled={regLoading}
                    >
                      {regLoading ? <><Spinner size="sm" className="me-2" />Creating account...</> : "Create Account"}
                    </Button>
                  </motion.div>

                  <div className="auth-divider">
                    <span>or continue with</span>
                  </div>

                  <Button
                    variant="outline-light"
                    className="auth-google-btn"
                    onClick={handleGoogleLogin}
                    disabled={regLoading}
                  >
                    <FaGoogle className="me-2" />
                    Continue with Google
                  </Button>

                  <p className="auth-switch-text">
                    Already have an account?{" "}
                    <span className="auth-switch-link" onClick={switchToLogin}>
                      Sign In
                    </span>
                  </p>
                </Form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Modal>
  );
}

export default AuthModal;
