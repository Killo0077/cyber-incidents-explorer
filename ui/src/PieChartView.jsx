import { useState, useEffect, useMemo } from "react";
import Navigation from "./Navigation";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import Papa from "papaparse";
import "./VisualizationView.css";

const COLORS = ["#667eea", "#764ba2", "#f093fb", "#4facfe", "#43e97b", "#fa709a", "#fee140", "#30cfd0"];

export default function PieChartView() {
  const [data, setData] = useState([]);
  const [selectedFeature, setSelectedFeature] = useState("actor_type");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [countries, setCountries] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const features = [
    { value: "actor_type", label: "Actor Type" },
    { value: "industry", label: "Industry" },
    { value: "motive", label: "Motive" },
    { value: "event_type", label: "Event Type" },
    { value: "event_subtype", label: "Event Subtype" },
    { value: "year", label: "Year" },
    { value: "month", label: "Month" },
    { value: "nato", label: "NATO Member" },
    { value: "eu", label: "EU Member" }
  ];

  useEffect(() => {
    Papa.parse("/data/cyber_clean.csv", {
      download: true,
      header: true,
      complete: (results) => {
        setData(results.data);
        const uniqueCountries = [...new Set(results.data.map(row => row.country).filter(Boolean))];
        setCountries(uniqueCountries.sort());
      },
      error: (error) => {
        console.error("Error loading CSV:", error);
      }
    });
  }, []);

  const filteredData = useMemo(() => {
    return data.filter(row => {
      const matchesCountry = !selectedCountry || row.country === selectedCountry;
      
      // Date filtering
      let matchesDate = true;
      if (startDate || endDate) {
        const eventDate = row.event_date ? new Date(row.event_date) : null;
        if (eventDate) {
          if (startDate && eventDate < new Date(startDate)) matchesDate = false;
          if (endDate && eventDate > new Date(endDate)) matchesDate = false;
        } else {
          matchesDate = false;
        }
      }
      
      return matchesCountry && matchesDate && row[selectedFeature]; // Only include rows with the selected feature
    });
  }, [data, selectedCountry, selectedFeature, startDate, endDate]);

  const chartData = useMemo(() => {
    const featureCounts = {};
    filteredData.forEach(row => {
      const value = row[selectedFeature] || "Unknown";
      featureCounts[value] = (featureCounts[value] || 0) + 1;
    });
    
    return Object.entries(featureCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredData, selectedFeature]);

  return (
    <>
      <Navigation />
      <div className="main-content">
        <div className="content-card">
          <h2>Incident Distribution Analysis</h2>
          
          <div className="controls">
            <div className="control-group">
              <label htmlFor="feature">Visualize By:</label>
              <select
                id="feature"
                value={selectedFeature}
                onChange={(e) => setSelectedFeature(e.target.value)}
              >
                {features.map(feature => (
                  <option key={feature.value} value={feature.value}>
                    {feature.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="control-group">
              <label htmlFor="country">Filter by Country:</label>
              <select
                id="country"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
              >
                <option value="">All Countries</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>

            <div className="control-group date-range-group">
              <label>Date Range:</label>
              <div className="date-inputs">
                <div className="date-input">
                  <label htmlFor="startDate" className="date-sub-label">Start</label>
                  <input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="date-input">
                  <label htmlFor="endDate" className="date-sub-label">End</label>
                  <input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="stats">
            <p><strong>Total Incidents:</strong> {filteredData.length}</p>
            <p><strong>Categories:</strong> {chartData.length}</p>
            {selectedCountry && <p><strong>Country:</strong> {selectedCountry}</p>}
            {(startDate || endDate) && (
              <p><strong>Date Range:</strong> {startDate || "earliest"} to {endDate || "latest"}</p>
            )}
          </div>

          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ textAlign: "center", color: "#999", marginTop: "2rem" }}>
              No data available for the selected filters
            </p>
          )}
        </div>
      </div>
    </>
  );
}
