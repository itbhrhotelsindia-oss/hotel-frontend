import React, { useEffect, useState } from "react";
import axios from "axios";

export function AgentDashboard() {
  const [hotels, setHotels] = useState([]);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    loadHotels();
  }, []);

  const loadHotels = async () => {
    try {
      const token = localStorage.getItem("agentToken");

      const response = await axios.get(`${BASE_URL}/api/agent/hotels`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setHotels(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Agent Dashboard</h2>

      <h3>Your Hotels</h3>

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        {hotels.map((hotel) => (
          <div
            key={hotel.hotelId}
            style={{
              border: "1px solid #ccc",
              padding: "20px",
              width: "250px",
              borderRadius: "8px",
            }}
          >
            <h4>{hotel.hotelName}</h4>

            <p>{hotel.city}</p>
            <button
              style={{
                marginTop: "10px",
                padding: "10px 15px",
                backgroundColor: "#b8963f",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "600",
              }}
              onClick={() =>
                (window.location.href = `/booking?hotelId=${hotel.hotelId}`)
              }
            >
              Start Booking
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
