import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./LoginPage.css";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { users, login, addUser } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const exists = users.some(u => (u.username || "").toLowerCase() === (username || "").toLowerCase());
    if (exists) {
      setError("Username already exists");
      return;
    }

  // Add the new user to the managed users list so it's persisted and visible to admin
  addUser(username.trim(), password, firstName.trim(), lastName.trim(), email.trim(), "analyst");
  // Log the user in for the session
  login(username, "analyst");
    navigate("/");
  };

  return (
    <div className="login-container">
        <div className="login-card">
          <h1>Create an account</h1>
          <h2>Sign up</h2>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>First Name</label>
              <input value={firstName} onChange={e => setFirstName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input value={lastName} onChange={e => setLastName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Username</label>
              <input value={username} onChange={e => setUsername(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="login-button">Sign Up</button>
          </form>
        </div>
      </div>
  );
}
