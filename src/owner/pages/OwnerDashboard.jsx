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
        if (!token) throw new Error("Not authenticated");

        /* ============================
           1️⃣ FETCH OWNER HOTELS (IDs)
           ============================ */
        const ownerRes = await fetch(`${BASE_URL}/api/owner/hotels`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!ownerRes.ok) {
          throw new Error("Failed to load owner hotels");
        }

        const ownerHotels = await ownerRes.json();
        // expected: [{ hotelId: "HOTEL-JIMCORBETT-001" }, ...]

        /* ============================
           2️⃣ FETCH CITIES (MASTER DATA)
           ============================ */
        const citiesRes = await fetch(`${BASE_URL}/api/cities/`);
        if (!citiesRes.ok) {
          throw new Error("Failed to load cities data");
        }

        const citiesData = await citiesRes.json();

        /* ============================
           3️⃣ FLATTEN HOTELS FROM CITIES
           ============================ */
        const allCityHotels = citiesData.flatMap((city) =>
          city.hotels.map((hotel) => ({
            hotelId: hotel.hotelId,
            hotelName: hotel.name, // 👈 SOURCE OF TRUTH
            cityName: city.name,
            imageUrl: hotel.imageUrl,
          }))
        );

        /* ============================
           4️⃣ MATCH BY hotelId
           ============================ */
        const mergedHotels = ownerHotels
          .map((ownerHotel) =>
            allCityHotels.find(
              (cityHotel) => cityHotel.hotelId === ownerHotel.hotelId
            )
          )
          .filter(Boolean); // remove unmatched

        setHotels(mergedHotels);
      } catch (err) {
        console.error("OwnerDashboard error:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    loadOwnerHotels();
  }, [BASE_URL]);

  /* ============================
     UI STATES
     ============================ */

  if (loading) {
    return (
      <div style={styles.center}>
        <h2>Loading your hotels...</h2>
      </div>
    );
  }

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
            <div key={hotel.hotelId} style={styles.card}>
              <h3 style={styles.hotelName}>{hotel.hotelName}</h3>
              <p style={styles.cityName}>{hotel.cityName}</p>

              <button
                style={styles.button}
                onClick={() => navigate(`/owner/hotel/${hotel.hotelId}`)}
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

/* ============================
   STYLES
   ============================ */

const styles = {
  container: {
    padding: "24px",
  },
  heading: {
    marginBottom: "16px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "14px",
  },
  card: {
    background: "#d6d6d6",
    borderRadius: "8px",
    padding: "24px",
    boxShadow: "0 6px 14px rgba(0,0,0,0.08)",
  },
  hotelName: {
    marginBottom: "4px",
  },
  cityName: {
    fontSize: "13px",
    color: "#666",
    marginBottom: "10px",
  },
  button: {
    padding: "10px 14px",
    marginTop: "20px",
    background: "#c9a44d",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "13px",
  },
  center: {
    minHeight: "60vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};
