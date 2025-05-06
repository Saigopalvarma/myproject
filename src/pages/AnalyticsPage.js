import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "bootstrap/dist/css/bootstrap.min.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const AnalyticsPage = () => {
  const { id } = useParams();
  const [attendeesData, setAttendeesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ profession: "", reasonForInterest: "" });
  const [professionOptions, setProfessionOptions] = useState([]);
  const [reasonOptions, setReasonOptions] = useState([]);

  const userEmail = localStorage.getItem("userEmail");
  const userFullName = localStorage.getItem("userFullName");
  const userRole = localStorage.getItem("userRole");
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchAttendeesData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/events/${id}/attendees/details`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        const data = await response.json();
        if (response.ok && Array.isArray(data)) {
          setAttendeesData(data);

          // Dynamically extract unique professions and reasons
          const professions = [...new Set(data.map((d) => d.profession))];
          const reasons = [...new Set(data.map((d) => d.reason_for_interest))];
          setProfessionOptions(professions);
          setReasonOptions(reasons);
        } else {
          console.error("Failed to fetch attendees data", data);
        }
      } catch (err) {
        console.error("Error fetching attendees data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendeesData();
  }, [id, authToken]);

  // Prepare Pie chart data based on current filters
  const filteredData = attendeesData.filter(
    (attendee) =>
      (filters.profession === "" || attendee.profession === filters.profession) &&
      (filters.reasonForInterest === "" || attendee.reason_for_interest === filters.reasonForInterest)
  );

  const professionCount = {};
  const interestCount = {};

  filteredData.forEach((attendee) => {
    professionCount[attendee.profession] = (professionCount[attendee.profession] || 0) + 1;
    interestCount[attendee.reason_for_interest] = (interestCount[attendee.reason_for_interest] || 0) + 1;
  });

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  const professionChartData = {
    labels: Object.keys(professionCount),
    datasets: [
      {
        data: Object.values(professionCount),
        backgroundColor: ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#33FFF6"],
      },
    ],
  };

  const interestChartData = {
    labels: Object.keys(interestCount),
    datasets: [
      {
        data: Object.values(interestCount),
        backgroundColor: ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#33FFF6"],
      },
    ],
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Event Analytics</h2>
      <p className="text-center text-muted">
        Logged in as: <strong>{userFullName}</strong> ({userEmail}) - Role: <strong>{userRole}</strong>
      </p>

      {/* Filters Section */}
      <div className="text-center mb-4">
        <h4>Filter Attendees</h4>
        <form className="d-flex justify-content-center flex-wrap gap-3">
          <select
            name="profession"
            value={filters.profession}
            onChange={handleFilterChange}
            className="form-select"
            style={{ maxWidth: "300px" }}
          >
            <option value="">All Professions</option>
            {professionOptions.map((profession, i) => (
              <option key={i} value={profession}>
                {profession}
              </option>
            ))}
          </select>

          <select
            name="reasonForInterest"
            value={filters.reasonForInterest}
            onChange={handleFilterChange}
            className="form-select"
            style={{ maxWidth: "300px" }}
          >
            <option value="">All Reasons</option>
            {reasonOptions.map((reason, i) => (
              <option key={i} value={reason}>
                {reason}
              </option>
            ))}
          </select>
        </form>
      </div>

      {/* Charts Section */}
      {loading ? (
        <div className="text-center mt-5">
          <p>Loading analytics...</p>
        </div>
      ) : (
        <div className="row justify-content-center mt-4">
          <div className="col-md-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h4 className="text-center">Profession</h4>
                <div style={{ height: "300px" }}>
                  <Pie data={professionChartData} options={pieOptions} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h4 className="text-center">Interest</h4>
                <div style={{ height: "300px" }}>
                  <Pie data={interestChartData} options={pieOptions} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;