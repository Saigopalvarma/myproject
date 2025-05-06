import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const ExportAttendeesButton = ({ eventId }) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/attendees/export/${eventId}`);
      if (!response.ok) {
        throw new Error("Failed to download file");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `attendees_${eventId}.csv`;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to download the CSV file");
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="btn btn-primary"
    >
      Export Attendees
    </button>
  );
};

export default ExportAttendeesButton;