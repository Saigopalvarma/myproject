import React, { useState, useEffect } from "react";
import QRCodeDisplay from "../components/QRCodeDisplay";
import "bootstrap/dist/css/bootstrap.min.css";

const QRCodePage = () => {
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        alert("You must be logged in to view your registered events.");
        window.location.href = "/login";
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:5000/api/user/registered-events", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setRegisteredEvents(data);
        } else {
          setError(data.error || "Failed to fetch registered events.");
        }
      } catch (error) {
        setError("Error fetching registered events: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRegisteredEvents();
  }, []);

  if (loading) {
    return <p className="text-center mt-5">Loading your registered events...</p>;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">My Registered Events</h2>
      {error && <p className="text-danger text-center">{error}</p>}
      {registeredEvents.length > 0 ? (
        <div className="row">
          {registeredEvents.map((event, index) => (
            <div key={index} className="col-md-6 col-lg-4 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{event.event_title}</h5>
                  <p className="card-text">
                    <strong>Date:</strong> {event.event_date}
                  </p>
                  <p className="card-text">
                    <strong>Location:</strong> {event.event_location}
                  </p>

                  {/* Check if the QR code is available and valid */}
                  {event.qr_code && event.qr_code.trim() !== "" ? (
                    <div className="text-center mt-3">
                      <QRCodeDisplay value={event.qr_code} />
                    </div>
                  ) : (
                    <p className="text-danger">Failed to generate QR code for this event.</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted">You have not registered for any events yet.</p>
      )}
    </div>
  );
};

export default QRCodePage;