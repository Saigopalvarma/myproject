import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children, requiredRole }) => {
  const { authToken } = useContext(AuthContext);

  // Simulate role-based access (replace with actual role-checking logic)
  const userRole = localStorage.getItem("userRole"); // Example: "admin" or "user"

  if (!authToken) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;