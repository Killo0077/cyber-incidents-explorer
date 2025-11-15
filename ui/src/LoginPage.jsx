import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./HomePage.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (role) => {
    login(role);
    navigate("/");
  };

  return (
    <div className="main-content">
      <div className="content-card">
        <h1>Cyber Security Events App</h1>
        <h2>Select Your Role</h2>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "2rem" }}>
          <button
            onClick={() => handleLogin("admin")}
            style={{
              padding: "0.75rem 2rem",
              fontSize: "1rem",
              backgroundColor: "#667eea",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "background 0.3s ease"
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#764ba2")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#667eea")}
          >
            Admin
          </button>
          <button
            onClick={() => handleLogin("analyst")}
            style={{
              padding: "0.75rem 2rem",
              fontSize: "1rem",
              backgroundColor: "#667eea",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "background 0.3s ease"
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#764ba2")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#667eea")}
          >
            Analyst
          </button>
        </div>
      </div>
    </div>
  );
}
