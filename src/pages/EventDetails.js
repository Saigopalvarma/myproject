import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import "bootstrap/dist/css/bootstrap.min.css";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/events/${id}`);
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };

    fetchEventDetails();
  }, [id]);

  const handleFillBasicDetails = () => {
    navigate(`/event/${id}/fill-details`);
  };

  const handleRegister = async () => {
    const authToken = localStorage.getItem("authToken");
    const userEmail = localStorage.getItem("userEmail");

    if (!authToken) {
      alert("You must be logged in to register for an event.");
      window.location.href = "/login";
      return;
    }

    if (!userEmail) {
      alert("User email not found. Please log in again.");
      return;
    }

    // ✅ Backend check for basic details
    try {
      const cleanId = id.trim();
      const checkResponse = await fetch(`http://127.0.0.1:5000/api/events/${cleanId}/attendees/check`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      const checkData = await checkResponse.json();
      if (!checkData.filled) {
        alert("Please fill in your basic details before registering.");
        return;
      }
    } catch (err) {
      console.error("Error checking basic details:", err);
      alert("Error verifying basic details. Please try again.");
      return;
    }

    // Proceed to register
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/events/${id}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        if (data.qr_code_url) {
          const qrCodeImageUrl = data.qr_code_url;
          setQrCodeUrl(qrCodeImageUrl);
          localStorage.setItem("qrCode", qrCodeImageUrl);

          // Send confirmation email using EmailJS
          emailjs
            .send(
              "service_qzqjxtb", // Replace with your EmailJS service ID
              "template_6yzu07p", // Replace with your EmailJS template ID
              {
                to_email: userEmail,
                event_name: event.title,
                event_place: event.location,
                qr_code_url: qrCodeImageUrl,
              },
              "QmqHaF-cBNHGhwREg" // Replace with your EmailJS user ID
            )
            .then(() => {
              alert("✅ Registration successful! A confirmation email has been sent.");
            })
            .catch((error) => {
              console.error("❌ EmailJS error:", error);
              alert("Registered successfully, but failed to send confirmation email.");
            });
        } else {
          console.error("❌ QR code not found in the response:", data);
          alert("Failed to generate QR code for the event.");
        }
      } else {
        console.error("❌ Registration failed:", data);
        alert(data.error || "Failed to register for the event.");
      }
    } catch (error) {
      console.error("❌ Network error during registration:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  if (!event) {
    return <p className="text-center mt-5">Loading event details...</p>;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h1 className="text-center mb-4">{event.title}</h1>
              <p><strong>Date:</strong> {event.date}</p>
              <p><strong>Location:</strong> {event.location}</p>
              <p><strong>Attendees:</strong> {event.current_attendees} / {event.max_seats}</p>
              <p>{event.description}</p>

              {/* Buttons */}
              <div className="d-flex justify-content-between mt-4">
                <button className="btn btn-secondary" onClick={handleFillBasicDetails}>
                  Fill Basic Details
                </button>
                <button className="btn btn-primary" onClick={handleRegister}>
                  Register
                </button>
              </div>

              {/* QR Code */}
              {qrCodeUrl && (
                <div className="text-center mt-4">
                  <h3>Your Event QR Code:</h3>
                  <img
                    src={qrCodeUrl}
                    alt="Event QR Code"
                    className="img-fluid"
                    style={{ maxWidth: "200px", height: "auto" }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;