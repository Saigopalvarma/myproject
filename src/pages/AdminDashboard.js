import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/users", {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchEvents = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/admin/events", {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchUsers();
    fetchEvents();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      if (response.ok) {
        alert("User deleted successfully!");
        setUsers(users.filter((user) => user._id !== userId));
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete user.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/admin/events/${eventId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      if (response.ok) {
        alert("Event deleted successfully!");
        setEvents(events.filter((event) => event._id !== eventId));
      } else {
        alert("Failed to delete event.");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Admin Dashboard</h2>

      {/* Add Organizer Button */}
      <div className="text-center mb-4">
        <Link to="/register?role=organizer" className="btn btn-success">
          + Add Organizer
        </Link>
      </div>

      {/* Users Section */}
      <div className="mb-5">
        <h3 className="mb-3">All Users</h3>
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    {user.email !== "saigopalvarma227@gmail.com" && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Events Section */}
      <div>
        <h3 className="mb-3">All Events</h3>
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Title</th>
                <th>Date</th>
                <th>Location</th>
                <th>Attendees</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event._id}>
                  <td>{event.title}</td>
                  <td>{event.date}</td>
                  <td>{event.location}</td>
                  <td>
                    {event.current_attendees} / {event.max_seats}
                  </td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteEvent(event._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;