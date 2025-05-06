import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  const queryParams = new URLSearchParams(location.search);
  const initialRole = queryParams.get("role") || "user";

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: initialRole,
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.password) {
      setError("All fields are required.");
      return;
    }

    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("authToken", data.access_token);
        localStorage.setItem("userRole", data.role);
        localStorage.setItem("userEmail", formData.email);
        localStorage.setItem("userFullName", formData.fullName);

        login(data.access_token, data.role, formData.email, formData.fullName);

        const redirectTo = location.state?.from || "/";
        navigate(redirectTo);
      } else {
        setError(data.error || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please check your network connection and try again.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="text-center mb-4">Register</h2>
              <form onSubmit={handleSubmit}>
                {/* Full Name Field */}
                <div className="mb-3">
                  <label htmlFor="fullName" className="form-label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    className="form-control"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Email Field */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Password Field */}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="form-control"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Role Field (Hidden) */}
                <input type="text" name="role" value={formData.role} readOnly hidden />

                {/* Submit Button */}
                <button type="submit" className="btn btn-primary w-100">
                  Register
                </button>

                {/* Error Message */}
                {error && <p className="text-danger text-center mt-3">{error}</p>}
              </form>

              {/* Redirect to Login */}
              <p className="text-center mt-3">
                Already have an account? <a href="/login">Login here</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;