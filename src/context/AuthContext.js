import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userFullName, setUserFullName] = useState(null);

  useEffect(() => {
    // Initialize state from localStorage
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");
    const email = localStorage.getItem("userEmail");
    const fullName = localStorage.getItem("userFullName");

    if (token && role && email && fullName) {
      setAuthToken(token);
      setUserRole(role);
      setUserEmail(email);
      setUserFullName(fullName);
    }
  }, []);

  const login = (token, role, email, fullName) => {
    setAuthToken(token);
    setUserRole(role);
    setUserEmail(email);
    setUserFullName(fullName);

    // Store these details in localStorage
    localStorage.setItem("authToken", token);
    localStorage.setItem("userRole", role);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userFullName", fullName);
  };

  const logout = () => {
    setAuthToken(null);
    setUserRole(null);
    setUserEmail(null);
    setUserFullName(null);

    // Remove from localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userFullName");
  };

  return (
    <AuthContext.Provider
      value={{
        authToken,
        userRole,
        userEmail,
        userFullName,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
