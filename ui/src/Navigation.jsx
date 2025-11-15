import { Link, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { useAuth } from "./AuthContext";
import "./Navigation.css";

export default function Navigation() {
  const [vizDropdownOpen, setVizDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setVizDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setVizDropdownOpen(false);
    }, 150); // 150ms delay
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <h1 className="navbar-title">Cyber Security Events App</h1>
        <ul className="navbar-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/reports">Reports</Link></li>
          <li 
            ref={dropdownRef}
            className="navbar-dropdown"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <span className="navbar-dropdown-label">Visualization</span>
            {vizDropdownOpen && (
              <ul className="navbar-submenu">
                <li><Link to="/visualization/table">Table View</Link></li>
                <li><Link to="/visualization/pie-chart">Pie Chart</Link></li>
              </ul>
            )}
          </li>
          {user?.role === "admin" && (
            <li><Link to="/accounts">User Management</Link></li>
          )}
          <li>
            <button
              onClick={handleLogout}
              style={{
                background: "none",
                border: "none",
                color: "white",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "500",
                padding: 0,
                transition: "opacity 0.3s ease"
              }}
              onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
              onMouseLeave={(e) => (e.target.style.opacity = "1")}
            >
              Logout ({user?.role})
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
