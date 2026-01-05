import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const HotelDashboard = function () {
  const { hotelId } = useParams();
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Hotel Dashboard</h1>
        <p>Hotel ID: {hotelId}</p>
      </div>

      <div style={styles.grid}>
        <div style={styles.card} onClick={() => navigate("room-types")}>
          <h3>Room Types</h3>
          <p>Manage room categories</p>
        </div>

        <div style={styles.card} onClick={() => navigate("inventory")}>
          <h3>Inventory</h3>
          <p>Manage availability & pricing</p>
        </div>

        <div style={{ ...styles.card, opacity: 0.6 }}>
          <h3>Bookings</h3>
          <p>(Coming soon)</p>
        </div>
      </div>

      <button
        style={styles.backBtn}
        onClick={() => navigate("/owner/dashboard")}
      >
        ← Back to Owner Dashboard
      </button>
    </div>
  );
};

export default HotelDashboard;

/* ---------------- STYLES ---------------- */

const styles = {
  container: {
    padding: "24px",
  },
  header: {
    marginBottom: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
  },
  card: {
    background: "#fff",
    padding: "18px",
    borderRadius: "8px",
    boxShadow: "0 6px 14px rgba(0,0,0,0.08)",
    cursor: "pointer",
  },
  backBtn: {
    marginTop: "24px",
    background: "transparent",
    border: "none",
    color: "#6A2C2C",
    cursor: "pointer",
  },
};
