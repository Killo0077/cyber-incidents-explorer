import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./LoginPage.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetUsername, setResetUsername] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");
  const navigate = useNavigate();
  const { login, users, resetPassword: resetUserPassword } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const needle = username.trim().toLowerCase();
    const user = users.find(u => (u.username || "").toLowerCase() === needle);
    
    if (!user) {
      setError("User not found");
      return;
    }

    if (user.password !== password) {
      setError("Invalid password");
      return;
    }

    // use stored username casing
    login(user.username, user.role);
    navigate("/");
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
    setResetUsername("");
    setResetPassword("");
    setResetError("");
    setResetSuccess("");
  };

  const handleGoSignup = () => {
    navigate("/signup");
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    setResetError("");
    setResetSuccess("");

    if (!resetUsername) {
      setResetError("Please enter your username");
      return;
    }
    if (!resetPassword) {
      setResetError("Please enter a new password");
      return;
    }

    const result = resetUserPassword(resetUsername, resetPassword);
    if (result.success) {
      setResetSuccess(result.message);
      setTimeout(() => {
        setShowForgotPassword(false);
        setResetUsername("");
        setResetPassword("");
      }, 1200);
    } else {
      setResetError(result.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Cyber Security Events App</h1>
        <h2>Login</h2>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button">
            Sign In
          </button>

          <div className="forgot-password-link">
            <button
              type="button"
              onClick={handleForgotPasswordClick}
              className="link-button"
            >
              Forgot Password?
            </button>
          </div>
          <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
            <button type="button" className="link-button" onClick={handleGoSignup}>
              Don't have an account? Sign up
            </button>
          </div>
        </form>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="modal-overlay" onClick={() => setShowForgotPassword(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Reset Password</h2>
            <div className="modal-body">
              <form onSubmit={handleResetPassword}>
                <div className="form-group">
                  <label htmlFor="reset-username">Username</label>
                  <input
                    id="reset-username"
                    type="text"
                    placeholder="Enter your username"
                    value={resetUsername}
                    onChange={(e) => setResetUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="new-password">New Password</label>
                  <input
                    id="new-password"
                    type="password"
                    placeholder="Enter new password"
                    value={resetPassword}
                    onChange={(e) => setResetPassword(e.target.value)}
                    required
                  />
                </div>
                {resetError && <div className="error-message">{resetError}</div>}
                {resetSuccess && <div className="success-message">{resetSuccess}</div>}
                <button type="submit" className="login-button" style={{ marginTop: "1rem" }}>
                  Reset Password
                </button>
              </form>
            </div>
            <div className="modal-footer">
              <button
                className="link-button"
                onClick={() => setShowForgotPassword(false)}
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
