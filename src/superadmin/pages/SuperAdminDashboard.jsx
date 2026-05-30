import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export default function SuperAdminDashboard() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [cities, setCities] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(null); // hotelId being toggled
  const [cleaning, setCleaning] = useState(false);
  const [cleanupResult, setCleanupResult] = useState(null);

  const loadData = useCallback(() => {
    setLoading(true);
    Promise.all([
      fetch(`${BASE_URL}/api/cities/all`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${BASE_URL}/api/admin/bookings`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    ])
      .then(([citiesData, bookingsData]) => {
        setCities(Array.isArray(citiesData) ? citiesData : []);
        setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [BASE_URL, token]);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Stats ──────────────────────────────────────────────────────────────
  const allHotels   = cities.flatMap(c => c.hotels || []);
  const totalHotels = allHotels.filter(h => h.active !== false).length;
  const confirmed   = bookings.filter(b => b.status === "CONFIRMED").length;
  const pending     = bookings.filter(b => b.status === "PENDING").length;
  const cancelled   = bookings.filter(b => b.status === "CANCELLED").length;

  // ── Toggle hotel active/inactive ───────────────────────────────────────
  const toggleHotelStatus = async (cityId, hotelId, currentActive) => {
    setToggling(hotelId);
    try {
      const newActive = !currentActive;
      const res = await fetch(
        `${BASE_URL}/api/cities/${cityId}/hotels/${hotelId}/status?active=${newActive}`,
        { method: "PATCH", headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Failed to update status");
      // Update state locally for instant feedback
      setCities(prev => prev.map(c =>
        c.id !== cityId ? c : {
          ...c,
          hotels: c.hotels.map(h =>
            h.hotelId !== hotelId ? h : { ...h, active: newActive }
          )
        }
      ));
    } catch (e) {
      alert("Failed to update hotel status: " + e.message);
    } finally {
      setToggling(null);
    }
  };

  // ── Cleanup inactive ───────────────────────────────────────────────────
  const handleCleanup = async () => {
    const preview = await fetch(`${BASE_URL}/api/admin/cleanup/inactive-hotels`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json());

    if (preview.inactiveCount === 0) {
      setCleanupResult({ message: "No inactive hotel details found. Nothing to delete." });
      return;
    }

    const ok = window.confirm(
      `Found ${preview.inactiveCount} inactive hotel detail(s):\n` +
      preview.hotels.map(h => `• ${h.name} (${h.hotelId}) — ${h.images.length} image(s)`).join('\n') +
      `\n\nPermanently delete them and their ImageKit photos?`
    );
    if (!ok) return;

    setCleaning(true);
    setCleanupResult(null);
    try {
      const result = await fetch(`${BASE_URL}/api/admin/cleanup/inactive-hotels`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      }).then(r => r.json());
      setCleanupResult(result);
      loadData();
    } catch (e) {
      setCleanupResult({ message: "Cleanup failed: " + e.message });
    } finally {
      setCleaning(false);
    }
  };

  const handleLogout = () => { localStorage.clear(); navigate("/owner/login"); };

  if (loading) return <div style={styles.center}><p>Loading dashboard...</p></div>;

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Super Admin Dashboard</h1>
          <p style={styles.subtitle}>Manage all hotels, bookings, and owners</p>
        </div>
        <div style={styles.headerActions}>
          <button style={styles.primaryBtn} onClick={() => navigate("/superadmin/hotels/new")}>+ Add New Hotel</button>
          <button style={styles.secondaryBtn} onClick={() => navigate("/superadmin/bookings")}>All Bookings</button>
          <button style={styles.cleanupBtn} onClick={handleCleanup} disabled={cleaning}>
            {cleaning ? "Cleaning..." : "🗑 Delete Inactive Hotels"}
          </button>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* CLEANUP RESULT */}
      {cleanupResult && (
        <div style={{ background: cleanupResult.message ? "#fef9c3" : "#dcfce7", border: "1px solid #d1d5db", borderRadius: "8px", padding: "14px 18px", marginBottom: "20px", fontSize: "14px" }}>
          {cleanupResult.message
            ? <p style={{ margin: 0 }}>{cleanupResult.message}</p>
            : <>
                <p style={{ margin: "0 0 4px", fontWeight: "600" }}>✅ Cleanup complete</p>
                <p style={{ margin: 0, color: "#374151" }}>Deleted {cleanupResult.deletedHotelsCount} hotel(s) and {cleanupResult.deletedImagesCount} image(s) from ImageKit.</p>
              </>
          }
          <button style={{ marginTop: "8px", background: "none", border: "none", color: "#6b7280", cursor: "pointer", fontSize: "12px" }} onClick={() => setCleanupResult(null)}>Dismiss</button>
        </div>
      )}

      {/* STATS */}
      <div style={styles.statsGrid}>
        {[
          { label: "Cities", value: cities.length, color: "#c9a44d" },
          { label: "Active Hotels", value: totalHotels, color: "#c9a44d" },
          { label: "Confirmed Bookings", value: confirmed, color: "#16a34a" },
          { label: "Pending Bookings", value: pending, color: "#d97706" },
          { label: "Cancelled Bookings", value: cancelled, color: "#dc2626" },
        ].map(s => (
          <div key={s.label} style={{ ...styles.statCard, borderTop: `4px solid ${s.color}` }}>
            <p style={styles.statValue}>{s.value}</p>
            <p style={styles.statLabel}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* HOTELS BY CITY */}
      {cities.length === 0 ? (
        <div style={styles.emptyState}>
          <p>No hotels found. <button style={styles.linkBtn} onClick={() => navigate("/superadmin/hotels/new")}>Add your first hotel →</button></p>
        </div>
      ) : (
        cities.map(city => (
          <div key={city.id} style={styles.cityBlock}>
            <div style={styles.cityHeader}>
              <div>
                <h2 style={styles.cityName}>{city.name}</h2>
                <span style={styles.cityState}>{city.state}</span>
              </div>
            </div>

            {(!city.hotels || city.hotels.length === 0) ? (
              <p style={{ color: "#9ca3af", fontSize: "14px", padding: "12px 0" }}>No hotels in this city.</p>
            ) : (
              <div style={styles.hotelsGrid}>
                {city.hotels.map(hotel => {
                  const isActive = hotel.active !== false;
                  return (
                    <div key={hotel.hotelId} style={{ ...styles.hotelCard, opacity: isActive ? 1 : 0.6, border: isActive ? "none" : "2px dashed #fca5a5" }}>
                      {hotel.imageUrl && (
                        <img src={hotel.imageUrl} alt={hotel.name} style={{ ...styles.hotelImg, filter: isActive ? "none" : "grayscale(60%)" }} />
                      )}
                      <div style={styles.hotelBody}>

                        {/* Title + status badge */}
                        <div style={styles.hotelTitleRow}>
                          <h3 style={styles.hotelName}>{hotel.name}</h3>
                          <span style={{ ...styles.statusBadge, ...(isActive ? styles.badgeActive : styles.badgeInactive) }}>
                            {isActive ? "Active" : "Inactive"}
                          </span>
                        </div>

                        <p style={styles.hotelId}>{hotel.hotelId}</p>

                        {hotel.services?.length > 0 && (
                          <div style={styles.tags}>
                            {hotel.services.map(s => <span key={s} style={styles.tag}>{s}</span>)}
                          </div>
                        )}

                        {/* Action buttons */}
                        {isActive && (
                          <div style={{ ...styles.hotelActions, marginBottom: "10px" }}>
                            <button style={styles.actionBtn} onClick={() => navigate(`/superadmin/hotel/${hotel.hotelId}`)}>Manage</button>
                            <button style={styles.actionBtnSecondary} onClick={() => navigate(`/superadmin/hotel/${hotel.hotelId}/room-types`)}>Room Types</button>
                            <button style={styles.actionBtnSecondary} onClick={() => navigate(`/superadmin/hotel/${hotel.hotelId}/inventory`)}>Inventory</button>
                          </div>
                        )}

                        {/* Toggle active/inactive */}
                        <button
                          style={isActive ? styles.deactivateBtn : styles.activateBtn}
                          disabled={toggling === hotel.hotelId}
                          onClick={() => toggleHotelStatus(city.id, hotel.hotelId, isActive)}
                        >
                          {toggling === hotel.hotelId
                            ? "Updating..."
                            : isActive ? "⏸ Set Inactive" : "▶ Set Active"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  page: { padding: "32px", minHeight: "100vh", background: "#f4f6f8", fontFamily: "Inter, system-ui, sans-serif" },
  center: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px", flexWrap: "wrap", gap: "16px" },
  title: { fontSize: "28px", fontWeight: "700", color: "#111827", marginBottom: "4px" },
  subtitle: { fontSize: "14px", color: "#6b7280" },
  headerActions: { display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" },
  primaryBtn: { padding: "10px 18px", background: "#c9a44d", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "14px" },
  secondaryBtn: { padding: "10px 18px", background: "#fff", color: "#374151", border: "1px solid #d1d5db", borderRadius: "6px", cursor: "pointer", fontSize: "14px" },
  cleanupBtn: { padding: "10px 18px", background: "#fff", color: "#dc2626", border: "1px solid #fca5a5", borderRadius: "6px", cursor: "pointer", fontSize: "14px" },
  logoutBtn: { padding: "10px 18px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "16px", marginBottom: "36px" },
  statCard: { background: "#fff", borderRadius: "10px", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", textAlign: "center" },
  statValue: { fontSize: "32px", fontWeight: "700", color: "#111827", margin: "0 0 4px 0" },
  statLabel: { fontSize: "13px", color: "#6b7280", margin: 0 },
  cityBlock: { marginBottom: "36px" },
  cityHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" },
  cityName: { fontSize: "20px", fontWeight: "600", color: "#1f2937", margin: "0 0 2px 0" },
  cityState: { fontSize: "13px", color: "#9ca3af" },
  hotelsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" },
  hotelCard: { background: "#fff", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.07)", overflow: "hidden", transition: "opacity 0.2s" },
  hotelImg: { width: "100%", height: "160px", objectFit: "cover" },
  hotelBody: { padding: "16px" },
  hotelTitleRow: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" },
  hotelName: { fontSize: "16px", fontWeight: "600", color: "#111827", margin: 0, flex: 1 },
  statusBadge: { fontSize: "11px", padding: "2px 8px", borderRadius: "99px", fontWeight: "600", whiteSpace: "nowrap" },
  badgeActive: { background: "#dcfce7", color: "#16a34a" },
  badgeInactive: { background: "#fee2e2", color: "#dc2626" },
  hotelId: { fontSize: "12px", color: "#9ca3af", marginBottom: "8px" },
  tags: { display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "10px" },
  tag: { background: "#f3f4f6", color: "#374151", fontSize: "11px", padding: "2px 8px", borderRadius: "99px" },
  hotelActions: { display: "flex", gap: "8px", flexWrap: "wrap" },
  actionBtn: { padding: "7px 14px", background: "#c9a44d", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "13px", fontWeight: "600" },
  actionBtnSecondary: { padding: "7px 14px", background: "#f3f4f6", color: "#374151", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "13px" },
  deactivateBtn: { width: "100%", padding: "7px", background: "#fff", color: "#dc2626", border: "1px solid #fca5a5", borderRadius: "5px", cursor: "pointer", fontSize: "13px", marginTop: "4px" },
  activateBtn: { width: "100%", padding: "7px", background: "#f0fdf4", color: "#16a34a", border: "1px solid #86efac", borderRadius: "5px", cursor: "pointer", fontSize: "13px", marginTop: "4px" },
  emptyState: { textAlign: "center", padding: "60px 20px", color: "#6b7280" },
  linkBtn: { background: "none", border: "none", color: "#c9a44d", cursor: "pointer", fontSize: "14px", fontWeight: "600" },
};
