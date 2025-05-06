import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const FillDetailsForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    profession: "",
    college: "",
    yearOfPassing: "",
    reasonForInterest: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    if (!formData.profession || !formData.reasonForInterest) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    if (
      formData.profession.toLowerCase() === "student" &&
      (!formData.college || !formData.yearOfPassing)
    ) {
      setError("Please fill in college and year of passing details.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setError("User not authenticated.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `http://127.0.0.1:5000/api/events/${id}/attendee-details`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        navigate(`/event/${id}`);
      } else {
        const data = await response.json();
        setError(data?.error || "Failed to submit details.");
      }
    } catch (err) {
      setError("An error occurred while submitting the details.");
    }

    setLoading(false);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="text-center mb-4">Fill Your Basic Details</h2>

              <form onSubmit={handleSubmit}>
                {/* Profession Field */}
                <div className="mb-3">
                  <label htmlFor="profession" className="form-label">
                    Profession:
                  </label>
                  <input
                    type="text"
                    id="profession"
                    name="profession"
                    className="form-control"
                    placeholder="Enter your profession"
                    value={formData.profession}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Conditional Fields for Students */}
                {formData.profession.toLowerCase() === "student" && (
                  <>
                    <div className="mb-3">
                      <label htmlFor="college" className="form-label">
                        College:
                      </label>
                      <input
                        type="text"
                        id="college"
                        name="college"
                        className="form-control"
                        placeholder="Enter your college name"
                        value={formData.college}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="yearOfPassing" className="form-label">
                        Year of Passing:
                      </label>
                      <input
                        type="number"
                        id="yearOfPassing"
                        name="yearOfPassing"
                        className="form-control"
                        placeholder="Enter your year of passing"
                        value={formData.yearOfPassing}
                        onChange={handleChange}
                      />
                    </div>
                  </>
                )}

                {/* Reason for Interest Field */}
                <div className="mb-3">
                  <label htmlFor="reasonForInterest" className="form-label">
                    Reason for Interest:
                  </label>
                  <textarea
                    id="reasonForInterest"
                    name="reasonForInterest"
                    className="form-control"
                    placeholder="Why are you interested in this event?"
                    value={formData.reasonForInterest}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Error Message */}
                {error && <p className="text-danger">{error}</p>}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-100"
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FillDetailsForm;