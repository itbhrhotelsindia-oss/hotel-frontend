import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const HotelDashboard = function () {
  const { hotelId } = useParams();
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Hotel Dashboard</h1>
          <p style={styles.subtitle}>
            Managing Hotel ID: <strong>{hotelId}</strong>
          </p>
        </div>

        <button
          style={styles.backBtn}
          onClick={() => navigate("/owner/dashboard")}
        >
          ← Back to Owner Dashboard
        </button>
      </div>

      {/* DASHBOARD CARDS */}
      <div style={styles.grid}>
        <div style={styles.card} onClick={() => navigate("room-types")}>
          <div style={styles.icon}>🛏️</div>
          <h3 style={styles.cardTitle}>Room Types</h3>
          <p style={styles.cardDesc}>Create and manage room categories</p>
        </div>

        <div style={styles.card} onClick={() => navigate("inventory")}>
          <div style={styles.icon}>📅</div>
          <h3 style={styles.cardTitle}>Inventory</h3>
          <p style={styles.cardDesc}>Control availability & pricing</p>
        </div>

        {/* Future Feature */}
        {/* <div style={{ ...styles.card, ...styles.disabledCard }}>
          <div style={styles.icon}>📖</div>
          <h3 style={styles.cardTitle}>Bookings</h3>
          <p style={styles.cardDesc}>(Coming soon)</p>
        </div> */}
      </div>
    </div>
  );
};

export default HotelDashboard;

const styles = {
  page: {
    padding: "32px",
    minHeight: "100vh",
    background: "#f4f6f8",
    fontFamily: "Inter, system-ui, sans-serif",
  },

  /* HEADER */
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },

  title: {
    fontSize: "28px",
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: "6px",
  },

  subtitle: {
    fontSize: "14px",
    color: "#6b7280",
  },

  backBtn: {
    padding: "10px 16px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    background: "#fff",
    color: "#374151",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.2s ease",
  },

  /* GRID */
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
    gap: "20px",
  },

  /* CARD */
  card: {
    background: "#ffffff",
    padding: "28px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
    cursor: "pointer",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },

  icon: {
    fontSize: "34px",
    marginBottom: "12px",
  },

  cardTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "6px",
  },

  cardDesc: {
    fontSize: "14px",
    color: "#6b7280",
    lineHeight: "1.5",
  },

  /* DISABLED CARD */
  disabledCard: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
};
