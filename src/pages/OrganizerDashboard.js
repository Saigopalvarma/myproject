import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import QRCodeScanner from "../components/QRCodeScanner";
import "bootstrap/dist/css/bootstrap.min.css";

const OrganizerDashboard = () => {
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const successMsg = location.state?.message;

  useEffect(() => {
    const fetchEvents = async () => {
      const authToken = localStorage.getItem("authToken");
      try {
        const response = await fetch("http://127.0.0.1:5000/api/organizer/events", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setEvents(data);
        } else {
          setMessage(data.error || "Failed to fetch events.");
        }
      } catch (err) {
        setMessage("An error occurred. Please try again.");
      }
    };

    fetchEvents();
  }, []);

  const handleScanSuccess = async (scannedData) => {
    console.log("Scanned QR Code Data:", scannedData);
    setShowScanner(false);

    if (!selectedEventId) {
      alert("No event selected for check-in.");
      return;
    }

    try {
      const authToken = localStorage.getItem("authToken");
      const response = await fetch(
        `http://127.0.0.1:5000/api/events/${selectedEventId}/checkin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ qr_code: scannedData }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert("Check-in successful!");
      } else {
        alert(data.error || "Failed to check in attendee.");
      }
    } catch (err) {
      console.error("Error during check-in:", err);
      alert("An error occurred during check-in. Please try again.");
    }
  };

  const handleOpenScanner = (eventId) => {
    if (showScanner) {
      alert("Scanner is already open.");
      return;
    }
    setSelectedEventId(eventId);
    setShowScanner(true);
  };

  const handleCloseScanner = () => {
    setShowScanner(false);
    setSelectedEventId(null);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Organizer Dashboard</h2>
      {successMsg && <p className="text-success text-center">{successMsg}</p>}
      {message && <p className="text-danger text-center">{message}</p>}

      {/* Add Event Button */}
      <div className="text-center mb-4">
        <Link to="/create-event" className="btn btn-success">
          + Add Event
        </Link>
      </div>

      {/* QR Code Scanner */}
      {showScanner && (
        <QRCodeScanner
          onScanSuccess={handleScanSuccess}
          onClose={handleCloseScanner}
        />
      )}

      {/* Events Section */}
      <div className="row">
        {events.map((event) => (
          <div key={event._id} className="col-md-6 col-lg-4 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{event.title}</h5>
                <p className="card-text">
                  <strong>Date:</strong> {event.date}
                </p>
                <p className="card-text">
                  <strong>Location:</strong> {event.location}
                </p>
                <p className="card-text">{event.description}</p>
                <p className="card-text">
                  <strong>Attendees:</strong> {event.current_attendees} / {event.max_seats}
                </p>

                {/* Action Buttons */}
                <div className="d-flex flex-wrap gap-2">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => navigate(`/edit-event/${event._id}`)}
                  >
                    Modify
                  </button>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => navigate(`/event/${event._id}/attendees`)}
                  >
                    View Attendees
                  </button>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => navigate(`/event/${event._id}/analyze`)}
                  >
                    Analyze
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleOpenScanner(event._id)}
                  >
                    Scan QR
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrganizerDashboard;