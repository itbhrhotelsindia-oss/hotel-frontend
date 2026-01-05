import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const OwnerDashboard = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOwnerHotels() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Not authenticated");
        }

        const res = await fetch(`${BASE_URL}/api/owner/hotels`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to load hotels");
        }

        const data = await res.json();
        setHotels(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("OwnerDashboard error:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    loadOwnerHotels();
  }, [BASE_URL]);

  // 🔄 Loading state
  if (loading) {
    return (
      <div style={styles.center}>
        <h2>Loading your hotels...</h2>
      </div>
    );
  }

  // ❌ Error state
  if (error) {
    return (
      <div style={styles.center}>
        <h2 style={{ color: "red" }}>{error}</h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Owner Dashboard</h1>

      {hotels.length === 0 ? (
        <p>No hotels assigned to you.</p>
      ) : (
        <div style={styles.grid}>
          {hotels.map((hotel) => (
            <div key={hotel.id || hotel._id} style={styles.card}>
              <h3>{hotel.name}</h3>
              <p>{hotel.city}</p>

              <button
                style={styles.button}
                onClick={() =>
                  navigatenavigate(`/owner/hotel/${hotel.hotelId}`)
                }
              >
                Manage Hotel
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;

/* ------------------ BASIC STYLES ------------------ */

const styles = {
  container: {
    padding: "24px",
  },
  heading: {
    marginBottom: "16px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "14px",
  },
  card: {
    background: "#fff",
    borderRadius: "8px",
    padding: "14px",
    boxShadow: "0 6px 14px rgba(0,0,0,0.08)",
  },
  button: {
    marginTop: "8px",
    padding: "6px 10px",
    background: "#6A2C2C",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "13px",
    cursor: "pointer",
  },
  center: {
    minHeight: "60vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};
