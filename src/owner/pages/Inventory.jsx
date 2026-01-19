import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Inventory = () => {
  const { hotelId } = useParams();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [roomTypes, setRoomTypes] = useState([]);
  const [roomTypeId, setRoomTypeId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ===============================
     LOAD ROOM TYPES
     =============================== */
  useEffect(() => {
    fetch(`${BASE_URL}/api/admin/room-types?hotelId=${hotelId}`)
      .then((res) => res.json())
      .then(setRoomTypes);
  }, [hotelId]);

  const selectedRoomType = roomTypes.find((r) => r.id === roomTypeId);

  /* ===============================
     LOAD INVENTORY (PREVIEW + REAL)
     =============================== */
  async function loadInventory() {
    if (!roomTypeId || !startDate || !endDate) return;
    setLoading(true);

    const res = await fetch(
      `${BASE_URL}/api/admin/inventory?hotelId=${hotelId}&roomTypeId=${roomTypeId}&startDate=${startDate}&endDate=${endDate}`,
    );

    const data = await res.json();

    setRows(
      data.map((d) => ({
        ...d,
        published: d.published ?? false, // 🔑 KEY FLAG
        isDirty: false,
        isSaving: false,
      })),
    );

    setLoading(false);
  }

  /* ===============================
     UPDATE ROW (DRAFT ONLY)
     =============================== */
  function updateRow(index, field, value) {
    setRows((prev) => {
      const copy = [...prev];
      const row = { ...copy[index] };

      if (field === "totalRooms") {
        row.totalRooms = Number(value);
      }

      if (field === "pricePerNight") {
        row.pricePerNight = Number(value);
      }

      row.isDirty = true;
      copy[index] = row;
      return copy;
    });
  }

  /* ===============================
     UPDATE EXISTING PUBLISHED ROW
     =============================== */
  async function saveRow(index) {
    const row = rows[index];
    row.isSaving = true;
    setRows([...rows]);

    await fetch(`${BASE_URL}/api/admin/inventory/date`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hotelId,
        roomTypeId,
        date: row.date,
        totalRooms: row.totalRooms,
        pricePerNight: row.pricePerNight,
      }),
    });

    row.isDirty = false;
    row.isSaving = false;
    setRows([...rows]);
  }

  /* ===============================
     PUBLISH INVENTORY (FIRST TIME SAVE)
     =============================== */
  async function publishRow(index) {
    const row = rows[index];
    row.isSaving = true;
    setRows([...rows]);

    await fetch(`${BASE_URL}/api/admin/inventory/publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hotelId,
        roomTypeId,
        startDate: row.date,
        endDate: row.date,
        totalRooms: row.totalRooms,
        pricePerNight: row.pricePerNight,
      }),
    });

    // 🔥 KEY FIX: Reload from backend
    await loadInventory();
  }

  /* ===============================
     BLOCK / UNBLOCK (PUBLISHED ONLY)
     =============================== */
  async function toggleStatus(index) {
    const row = rows[index];

    await fetch(`${BASE_URL}/api/admin/inventory/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hotelId,
        roomTypeId,
        date: row.date,
        active: !row.active,
      }),
    });

    row.active = !row.active;
    setRows([...rows]);
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.pageTitle}>Inventory Management</h2>
      <p style={styles.pageSubTitle}>
        Manage availability & pricing per room type
      </p>

      {/* FILTER BAR */}
      <div style={styles.filterBar}>
        <select
          value={roomTypeId}
          onChange={(e) => setRoomTypeId(e.target.value)}
          style={styles.select}
        >
          <option value="">Select Room Type</option>
          {roomTypes.map((rt) => (
            <option key={rt.id} value={rt.id}>
              {rt.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={styles.input}
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={styles.input}
        />

        <button
          onClick={loadInventory}
          disabled={!roomTypeId || !startDate || !endDate}
          style={styles.loadBtn}
        >
          Load Inventory
        </button>
      </div>

      {loading && <p>Loading inventory…</p>}

      {!loading && rows.length > 0 && (
        <div style={styles.table}>
          <div style={styles.headerRow}>
            <span>Date</span>
            <span>Rooms</span>
            <span>Price</span>
            <span>Publish Status</span>
            <span>Action</span>
          </div>

          {rows.map((r, i) => {
            const booked = r.published
              ? Math.max(0, r.totalRooms - r.availableRooms)
              : 0;

            const available = r.published ? r.availableRooms : r.totalRooms;

            const isLocked = r.published && booked > 0;

            return (
              <div
                key={r.date}
                style={{
                  ...styles.row,
                  background: !r.published
                    ? "#fff8e1" // draft
                    : r.isDirty
                      ? "#e3f2fd" // edited
                      : "#fff",
                }}
              >
                <span>{r.date}</span>

                <span style={{ display: "flex", flexDirection: "column" }}>
                  {/* INPUT ROW */}
                  <div
                    style={{
                      height: 44,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="number"
                      value={r.totalRooms}
                      disabled={isLocked}
                      onChange={(e) =>
                        updateRow(i, "totalRooms", e.target.value)
                      }
                      style={{
                        height: 36,
                        width: 80,
                        cursor: isLocked ? "not-allowed" : "text",
                        background: isLocked ? "#f3f4f6" : "#fff",
                        border: "1px solid #d1d5db",
                        borderRadius: 6,
                        padding: "0 10px",
                      }}
                    />
                  </div>

                  {/* DETAILS ROW (always same layout) */}
                  <div style={{ fontSize: 12, color: "#555", marginTop: 6 }}>
                    <div>
                      <strong>Capacity:</strong> {r.totalRooms}
                    </div>
                    <div>
                      <strong>Booked:</strong> {booked}
                    </div>
                    <div>
                      <strong>Available:</strong> {available}
                    </div>
                  </div>
                </span>

                <span
                  style={{
                    height: 44,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="number"
                    value={r.pricePerNight}
                    onChange={(e) =>
                      updateRow(i, "pricePerNight", e.target.value)
                    }
                    style={{
                      height: 36,
                      width: 110,
                      borderRadius: 6,
                      border: "1px solid #d1d5db",
                      padding: "0 10px",
                    }}
                  />
                </span>

                <span
                  style={{
                    ...styles.statusBadge,
                    background: r.published ? "#e8f5e9" : "#ffd693ff",
                    color: r.published ? "#2e7d32" : "#ef6c00",
                  }}
                >
                  {r.published ? "PUBLISHED" : "DRAFT"}
                </span>

                <span>
                  {!r.published && (
                    <button
                      onClick={() => publishRow(i)}
                      style={styles.publishBtn}
                    >
                      {r.isSaving ? "Publishing…" : "Publish"}
                    </button>
                  )}

                  {r.published && r.isDirty && (
                    <button onClick={() => saveRow(i)} style={styles.updateBtn}>
                      {r.isSaving ? "Saving…" : "Update"}
                    </button>
                  )}

                  {r.published && (
                    <button
                      onClick={() => toggleStatus(i)}
                      style={{
                        ...styles.blockBtn,
                        background: r.active ? "#c9a44d" : "#2e7d32",
                      }}
                    >
                      {r.active ? "Block" : "Unblock"}
                    </button>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export { Inventory };

/* ===============================
   STYLES
   =============================== */
const styles = {
  container: {
    padding: 28,
    background: "#f4f6f8",
    minHeight: "100vh",
    fontFamily: "Inter, system-ui, sans-serif",
  },

  pageTitle: {
    fontSize: 26,
    fontWeight: 600,
    color: "#1f2937",
    marginBottom: 4,
  },

  pageSubTitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 22,
  },

  filterBar: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 24,
    alignItems: "center",
  },

  select: {
    padding: "10px 12px",
    borderRadius: 6,
    border: "1px solid #d1d5db",
    minWidth: 200,
  },

  input: {
    padding: "10px 12px",
    borderRadius: 6,
    border: "1px solid #d1d5db",
  },

  loadBtn: {
    background: "linear-gradient(135deg,#b58b42,#9a7838)",
    color: "#fff",
    padding: "10px 22px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
  },

  table: {
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 10px 28px rgba(0,0,0,0.08)",
    background: "#fff",
  },

  headerRow: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr 1fr 1fr 1.4fr",
    padding: "14px 16px",
    fontWeight: 600,
    background: "#f9fafb",
    borderBottom: "1px solid #e5e7eb",
    position: "sticky",
    top: 0,
    zIndex: 1,
  },

  row: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr 1fr 1fr 1.4fr",
    padding: "14px 16px",
    alignItems: "center",
    borderBottom: "1px solid #f0f0f0",
    fontSize: 14,
  },

  statusBadge: {
    padding: "10px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
    display: "inline-block",
    textAlign: "center",
    maxWidth: 120,
  },

  publishBtn: {
    background: "#ef6c00",
    color: "#fff",
    border: "none",
    padding: "6px 14px",
    borderRadius: 6,
    cursor: "pointer",
    marginRight: 6,
  },

  updateBtn: {
    background: "#2e7d32",
    color: "#fff",
    border: "none",
    padding: "6px 14px",
    borderRadius: 6,
    cursor: "pointer",
    marginRight: 6,
  },

  blockBtn: {
    color: "#fff",
    border: "none",
    padding: "6px 14px",
    borderRadius: 6,
    cursor: "pointer",
  },
};
