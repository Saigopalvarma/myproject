import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const EditEvent = () => {
  const { eventId } = useParams(); // Get the event ID from the URL
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    max_seats: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      const authToken = localStorage.getItem("authToken");
      if (!eventId) {
        setMessage("Invalid event ID.");
        return;
      }

      try {
        const response = await fetch(`http://127.0.0.1:5000/api/events/${eventId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setFormData(data); // Populate the form with the event data
        } else {
          setMessage(data.error || "Failed to fetch event details.");
        }
      } catch (err) {
        setMessage("An error occurred. Please try again.");
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      setMessage("You must be logged in to update the event.");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:5000/api/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("Event updated successfully!");
        setTimeout(() => {
          navigate("/organizer"); // Redirect to organizer page after successful update
        }, 2000); // 2 seconds delay
      } else {
        setMessage(data.error || "Failed to update event.");
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
              <h2 className="text-center mb-4">Edit Event</h2>
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
                  Update Event
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

export default EditEvent;