import { useState } from "react";
import { useAuth } from "./AuthContext";
import Navigation from "./Navigation";
import "./LoginPage.css";

export default function ChangePasswordPage() {
  const { user, users, changePassword } = useAuth();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!user) return null;
  const currentUser = users.find(u => u.username === user.username);
  if (!currentUser) return <div>User not found</div>;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!oldPassword || !newPassword) {
      setError("Both fields are required");
      return;
    }
    const result = changePassword(currentUser.id, oldPassword, newPassword);
    if (result.success) {
      setSuccess("Password changed successfully");
      setOldPassword("");
      setNewPassword("");
    } else {
      setError(result.message);
    }
  };

  return (
    <>
      <Navigation />
      <div className="login-container">
        <div className="login-card">
          <h1>Change Password</h1>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="old-password">Old Password</label>
              <input
                id="old-password"
                type="password"
                value={oldPassword}
                onChange={e => setOldPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="new-password">New Password</label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            <button type="submit" className="login-button">Change Password</button>
          </form>
        </div>
      </div>
    </>
  );
}
