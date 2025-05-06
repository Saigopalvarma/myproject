import React from "react";
import { QRCodeSVG } from "qrcode.react";
import "bootstrap/dist/css/bootstrap.min.css";

const QRCodeDisplay = ({ value }) => {
  // Check if the value is valid
  if (!value) {
    return <p className="text-danger text-center">Error: Invalid QR code value.</p>; // Display an error if value is not valid
  }

  console.log("QR Code Value Passed to Component:", value); // Debugging

  return (
    <div className="d-flex flex-column align-items-center mt-4">
      {/* QR Code */}
      <div className="border border-secondary rounded p-3 mb-3">
        <QRCodeSVG value={value} size={256} level="L" />
      </div>

      {/* Description */}
      <p className="text-muted text-center">
        This QR code can be scanned for event check-ins.
      </p>
    </div>
  );
};

export default QRCodeDisplay;