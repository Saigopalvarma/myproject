import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import EventDetails from "./pages/EventDetails";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import CreateEvent from "./pages/CreateEvent";
import QRCodePage from "./pages/QRCodePage";
import AdminDashboard from "./pages/AdminDashboard";
import AttendeesPage from "./pages/AttendeesPage";
import EditEvent from "./pages/EditEvent";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import FillDetailsForm from "./components/FillDetailsForm"; // Import FillDetailsForm
import AnalyticsPage from "./pages/AnalyticsPage"; // Import AnalyticsPage
import 'bootstrap/dist/css/bootstrap.min.css';
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/ticket/:id" element={<QRCodePage />} />

        {/* Organizer/Admin Routes */}
        <Route
          path="/organizer"
          element={
            <PrivateRoute requiredRole="organizer">
              <OrganizerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-event"
          element={
            <PrivateRoute requiredRole="organizer">
              <CreateEvent />
            </PrivateRoute>
          }
        />
        <Route
          path="/event/:id/attendees"
          element={
            <PrivateRoute requiredRole="organizer">
              <AttendeesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute requiredRole="admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-event/:eventId"
          element={
            <PrivateRoute requiredRole="organizer">
              <EditEvent />
            </PrivateRoute>
          }
        />

        {/* Fill Details Route */}
        <Route
          path="/event/:id/fill-details"
          element={<FillDetailsForm />} // Route for filling basic details
        />

        {/* Analytics Route */}
        <Route
          path="/event/:id/analyze"
          element={<AnalyticsPage />} // Route for viewing event analytics
        />
      </Routes>
    </Router>
  );
}

export default App;
