import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    max_seats: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      setMessage("You must be logged in to create an event.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          ...formData,
          max_seats: parseInt(formData.max_seats, 10),
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("Event created successfully!");
        setFormData({ title: "", date: "", location: "", description: "", max_seats: "" });
      } else {
        setMessage(data.error || "Failed to create event.");
      }
    } catch (err) {
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="text-center mb-4">Create Event</h2>
              <form onSubmit={handleSubmit}>
                {/* Event Title */}
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Event Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    className="form-control"
                    placeholder="Enter event title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Event Date */}
                <div className="mb-3">
                  <label htmlFor="date" className="form-label">
                    Event Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    className="form-control"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Event Location */}
                <div className="mb-3">
                  <label htmlFor="location" className="form-label">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    className="form-control"
                    placeholder="Enter event location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Event Description */}
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    className="form-control"
                    placeholder="Enter event description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Maximum Seats */}
                <div className="mb-3">
                  <label htmlFor="max_seats" className="form-label">
                    Maximum Seats
                  </label>
                  <input
                    type="number"
                    id="max_seats"
                    name="max_seats"
                    className="form-control"
                    placeholder="Enter maximum seats"
                    value={formData.max_seats}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Submit Button */}
                <button type="submit" className="btn btn-primary w-100">
                  Create Event
                </button>

                {/* Message */}
                {message && <p className="text-center mt-3">{message}</p>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;