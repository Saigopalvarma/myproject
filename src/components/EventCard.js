// src/components/EventCard.js
import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const EventCard = ({ event }) => {
  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        {/* Event Title */}
        <h5 className="card-title fw-bold">{event.title}</h5>

        {/* Date and Location */}
        <div className="mb-3">
          <p className="card-text mb-1">
            <strong>Date:</strong> {event.date}
          </p>
          <p className="card-text">
            <strong>Location:</strong> {event.location}
          </p>
        </div>

        {/* Event Description */}
        <p className="card-text text-muted">{event.description}</p>

        {/* Register Button */}
        <Link to={`/event/${event._id}`} className="btn btn-primary">
          Register
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
