import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import "./Navigation.css";

export default function Navigation() {
  const [vizDropdownOpen, setVizDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const closeTimeoutRef = useRef(null);

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
          <li><Link to="/accounts">User Management</Link></li>
        </ul>
      </div>
    </nav>
  );
}
