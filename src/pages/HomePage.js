import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EventCard from "../components/EventCard";
import "bootstrap/dist/css/bootstrap.min.css";

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const userRole = localStorage.getItem("userRole"); // Get the user role from localStorage

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/events");
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="container mt-5">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-primary">Upcoming Events</h1>
        {/* Show the "Add Organizer" button only if the user is an admin */}
        {userRole === "admin" && (
          <Link to="/register?role=organizer" className="btn btn-success">
            + Add Organizer
          </Link>
        )}
      </div>

      {/* Events Grid */}
      <div className="row">
        {events.map((event) => (
          <div key={event._id} className="col-md-6 col-lg-4 mb-4">
            <EventCard event={event} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;