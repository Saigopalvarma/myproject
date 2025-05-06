import React, { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

const QrScanner = ({ onScanSuccess, onClose }) => {
  const qrReaderRef = useRef(null);
  const [isScannerActive, setIsScannerActive] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let scannerRunning = false;
    let html5QrCode = null;

    // Check if qrReaderRef.current is available
    if (qrReaderRef.current) {
      html5QrCode = new Html5Qrcode(qrReaderRef.current.id);
    }

    if (html5QrCode && isScannerActive) {
      html5QrCode
        .start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText, decodedResult) => {
            if (isMounted) {
              onScanSuccess(decodedText);
            }
          }
        )
        .then(() => {
          scannerRunning = true;
        })
        .catch((err) => {
          console.error("QR Scanner failed to start:", err);
        });
    }

    // Cleanup function to stop the scanner when the component unmounts or when the scanner is not needed
    return () => {
      isMounted = false;
      stopScanner(html5QrCode);
    };
  }, [isScannerActive, onScanSuccess]);

  const stopScanner = async (html5QrCode) => {
    if (html5QrCode) {
      try {
        await html5QrCode.stop();
        console.log("QR scanner stopped.");
      } catch (err) {
        console.warn("QR Scanner stop error:", err.message || err);
      }

      try {
        await html5QrCode.clear();
        console.log("QR scanner cleared.");
      } catch (err) {
        console.warn("QR Scanner clear error:", err.message || err);
      }
    }
  };

  const handleStartScan = () => {
    setIsScannerActive(true);
  };

  const handleStopScan = () => {
    setIsScannerActive(false);
    onClose(); // Close callback if necessary
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6 text-center">
          <h3 className="mb-4">Scan QR Code</h3>
          {!isScannerActive ? (
            <button className="btn btn-primary" onClick={handleStartScan}>
              Start Scanning
            </button>
          ) : (
            <>
              <div
                ref={qrReaderRef}
                id="qr-reader"
                className="border border-secondary rounded p-3"
                style={{ width: "100%", maxWidth: "400px", margin: "auto" }}
              />
              <button className="btn btn-danger mt-3" onClick={handleStopScan}>
                Close
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QrScanner;
