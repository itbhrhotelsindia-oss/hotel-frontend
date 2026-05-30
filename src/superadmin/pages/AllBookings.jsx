import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const STATUS_OPTIONS = ["ALL", "CONFIRMED", "PENDING", "CANCELLED"];

const statusStyle = {
  CONFIRMED: { background: "#dcfce7", color: "#16a34a" },
  PENDING:   { background: "#fef9c3", color: "#b45309" },
  CANCELLED: { background: "#fee2e2", color: "#dc2626" },
};

export default function AllBookings() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [bookings, setBookings] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterHotel, setFilterHotel] = useState(searchParams.get("hotelId") || "");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${BASE_URL}/api/cities/all`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setCities(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, [BASE_URL, token]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterHotel) params.set("hotelId", filterHotel);
    if (filterStatus !== "ALL") params.set("status", filterStatus);

    fetch(`${BASE_URL}/api/admin/bookings?${params}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setBookings(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [BASE_URL, token, filterHotel, filterStatus]);

  // Flatten all hotels for the dropdown
  const allHotels = cities.flatMap(c => (c.hotels || []).map(h => ({ hotelId: h.hotelId, label: `${h.name} (${c.name})` })));

  const getHotelName = (hotelId) => allHotels.find(h => h.hotelId === hotelId)?.label || hotelId;

  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>All Bookings</h1>
          <p style={styles.subtitle}>{bookings.length} booking{bookings.length !== 1 ? "s" : ""} found</p>
        </div>
        <button style={styles.backBtn} onClick={() => navigate("/superadmin/dashboard")}>← Dashboard</button>
      </div>

      {/* FILTERS */}
      <div style={styles.filters}>
        <select style={styles.select} value={filterHotel} onChange={e => setFilterHotel(e.target.value)}>
          <option value="">All Hotels</option>
          {allHotels.map(h => <option key={h.hotelId} value={h.hotelId}>{h.label}</option>)}
        </select>

        <div style={styles.statusTabs}>
          {STATUS_OPTIONS.map(s => (
            <button
              key={s}
              style={{ ...styles.statusTab, ...(filterStatus === s ? styles.statusTabActive : {}) }}
              onClick={() => setFilterStatus(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE */}
      {loading ? (
        <p style={{ color: "#6b7280", padding: "24px" }}>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <div style={styles.empty}>No bookings found for the selected filters.</div>
      ) : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>Booking ID</th>
                <th style={styles.th}>Guest</th>
                <th style={styles.th}>Hotel</th>
                <th style={styles.th}>Check-in</th>
                <th style={styles.th}>Check-out</th>
                <th style={styles.th}>Rooms</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Pay Mode</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Booked On</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id} style={styles.tr}>
                  <td style={{ ...styles.td, fontWeight: "600", color: "#c9a44d" }}>{b.bookingId}</td>
                  <td style={styles.td}>
                    <div>{b.guestName}</div>
                    <div style={{ fontSize: "12px", color: "#9ca3af" }}>{b.guestPhone}</div>
                  </td>
                  <td style={{ ...styles.td, fontSize: "12px" }}>{getHotelName(b.hotelId)}</td>
                  <td style={styles.td}>{formatDate(b.checkIn)}</td>
                  <td style={styles.td}>{formatDate(b.checkOut)}</td>
                  <td style={{ ...styles.td, textAlign: "center" }}>{b.rooms}</td>
                  <td style={{ ...styles.td, fontWeight: "600" }}>₹{b.totalAmount?.toLocaleString("en-IN")}</td>
                  <td style={{ ...styles.td, fontSize: "12px" }}>{b.payMode}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, ...(statusStyle[b.status] || {}) }}>{b.status}</span>
                  </td>
                  <td style={{ ...styles.td, fontSize: "12px", color: "#9ca3af" }}>{formatDate(b.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { padding: "32px", minHeight: "100vh", background: "#f4f6f8", fontFamily: "Inter, system-ui, sans-serif" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" },
  title: { fontSize: "26px", fontWeight: "700", color: "#111827", marginBottom: "4px" },
  subtitle: { fontSize: "14px", color: "#6b7280" },
  backBtn: { padding: "9px 16px", background: "#fff", border: "1px solid #d1d5db", borderRadius: "6px", cursor: "pointer", fontSize: "14px", color: "#374151" },
  filters: { display: "flex", gap: "16px", alignItems: "center", marginBottom: "20px", flexWrap: "wrap" },
  select: { padding: "9px 12px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", background: "#fff", minWidth: "220px" },
  statusTabs: { display: "flex", gap: "4px" },
  statusTab: { padding: "8px 14px", border: "1px solid #d1d5db", borderRadius: "6px", cursor: "pointer", fontSize: "13px", background: "#fff", color: "#374151" },
  statusTabActive: { background: "#c9a44d", color: "#fff", border: "1px solid #c9a44d" },
  tableWrap: { background: "#fff", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflow: "auto" },
  table: { width: "100%", borderCollapse: "collapse", minWidth: "900px" },
  thead: { background: "#f9fafb" },
  th: { padding: "12px 14px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #e5e7eb" },
  tr: { borderBottom: "1px solid #f3f4f6" },
  td: { padding: "12px 14px", fontSize: "14px", color: "#374151", verticalAlign: "middle" },
  badge: { display: "inline-block", padding: "3px 10px", borderRadius: "99px", fontSize: "12px", fontWeight: "600" },
  empty: { background: "#fff", borderRadius: "10px", padding: "40px", textAlign: "center", color: "#6b7280", fontSize: "14px" },
};
