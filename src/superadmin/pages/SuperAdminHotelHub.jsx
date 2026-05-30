import React from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function SuperAdminHotelHub() {
  const { hotelId } = useParams();
  const navigate = useNavigate();

  const cards = [
    { icon: "✏️", title: "Edit Hotel Details", desc: "Update slider, about, amenities, gallery, policies, FAQs", path: `/owner/hotels` },
    { icon: "🛏️", title: "Room Types", desc: "Create and manage room categories, pricing, and images", path: `room-types` },
    { icon: "📅", title: "Inventory", desc: "Control availability and pricing per date", path: `inventory` },
    { icon: "📋", title: "Bookings", desc: "View all bookings for this hotel", path: `/superadmin/bookings?hotelId=${hotelId}` },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Hotel Management</h1>
          <p style={styles.subtitle}>Hotel ID: <strong>{hotelId}</strong></p>
        </div>
        <button style={styles.backBtn} onClick={() => navigate("/superadmin/dashboard")}>
          ← Back to Dashboard
        </button>
      </div>

      <div style={styles.grid}>
        {cards.map(card => (
          <div
            key={card.title}
            style={styles.card}
            onClick={() => card.path.startsWith("/") ? navigate(card.path) : navigate(card.path)}
          >
            <div style={styles.icon}>{card.icon}</div>
            <h3 style={styles.cardTitle}>{card.title}</h3>
            <p style={styles.cardDesc}>{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: { padding: "32px", minHeight: "100vh", background: "#f4f6f8", fontFamily: "Inter, system-ui, sans-serif" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" },
  title: { fontSize: "26px", fontWeight: "700", color: "#111827", marginBottom: "4px" },
  subtitle: { fontSize: "14px", color: "#6b7280" },
  backBtn: { padding: "9px 16px", background: "#fff", border: "1px solid #d1d5db", borderRadius: "6px", cursor: "pointer", fontSize: "14px", color: "#374151" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" },
  card: { background: "#fff", borderRadius: "12px", padding: "28px", boxShadow: "0 2px 10px rgba(0,0,0,0.06)", cursor: "pointer", transition: "box-shadow 0.2s", borderTop: "4px solid #c9a44d" },
  icon: { fontSize: "32px", marginBottom: "14px" },
  cardTitle: { fontSize: "17px", fontWeight: "600", color: "#111827", marginBottom: "6px" },
  cardDesc: { fontSize: "13px", color: "#6b7280", lineHeight: "1.5" },
};
