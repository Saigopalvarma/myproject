import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const AttendeesPage = () => {
  const { id } = useParams(); // Event ID
  const [attendees, setAttendees] = useState([]);

  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/events/${id}/attendees`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });
        const data = await response.json();

        if (Array.isArray(data)) {
          setAttendees(data);
        } else {
          console.error("Unexpected response format", data);
          setAttendees([]);
        }
      } catch (error) {
        console.error("Error fetching attendees:", error);
        setAttendees([]);
      }
    };

    fetchAttendees();
  }, [id]);

  // Handle CSV download
  const handleDownloadCSV = () => {
    const token = localStorage.getItem("authToken");
    const downloadUrl = `http://127.0.0.1:5000/api/events/${id}/attendees/export`;

    fetch(downloadUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `attendees_event_${id}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => {
        console.error("Error downloading CSV:", err);
      });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Attendees</h2>
      {attendees.length === 0 ? (
        <p className="text-center text-muted">No attendees registered yet.</p>
      ) : (
        <>
          <div className="text-center mb-4">
            <button className="btn btn-primary" onClick={handleDownloadCSV}>
              📥 Download Attendee List
            </button>
          </div>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {attendees.map((attendee) => (
                  <tr key={attendee._id}>
                    <td>{attendee.fullName}</td>
                    <td>{attendee.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default AttendeesPage;