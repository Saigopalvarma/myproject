import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";

const Navbar = () => {
  const { authToken, userRole, userFullName, logout } = useContext(AuthContext); // Get from context
  const navigate = useNavigate();
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand fw-bold" to="/">
          Event Management
        </Link>

        {/* Toggle Button for Mobile View */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {authToken ? (
              <>
                {/* Dropdown for Authenticated Users */}
                <li className="nav-item dropdown">
                  <span
                    className="nav-link dropdown-toggle"
                    id="userDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {userFullName}
                  </span>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                    <li>
                      <Link className="dropdown-item" to="/">
                        Home
                      </Link>
                    </li>
                    {userRole === "admin" && (
                      <li>
                        <Link className="dropdown-item" to="/admin">
                          Admin Dashboard
                        </Link>
                      </li>
                    )}
                    {userRole === "organizer" && (
                      <li>
                        <Link className="dropdown-item" to="/organizer">
                          Organizer Dashboard
                        </Link>
                      </li>
                    )}
                    <li>
                      <Link className="dropdown-item" to="/ticket/myqr">
                        My QR Code
                      </Link>
                    </li>
                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="nav-link btn btn-primary text-white px-4" to="/login">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;