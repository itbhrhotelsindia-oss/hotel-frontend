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
      `${BASE_URL}/api/admin/inventory?hotelId=${hotelId}&roomTypeId=${roomTypeId}&startDate=${startDate}&endDate=${endDate}`
    );

    const data = await res.json();

    setRows(
      data.map((d) => ({
        ...d,
        published: d.published ?? false, // 🔑 KEY FLAG
        isDirty: false,
        isSaving: false,
      }))
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
        row.totalRooms = Math.min(
          Number(value),
          selectedRoomType?.maxGuests || 0
        );
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

    row.published = true;
    row.active = true;
    row.isDirty = false;
    row.isSaving = false;

    setRows([...rows]);
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
      <h2>Inventory</h2>

      {/* FILTER BAR */}
      <div style={styles.filterBar}>
        <select
          value={roomTypeId}
          onChange={(e) => setRoomTypeId(e.target.value)}
        >
          <option value="">Select Room Type</option>
          {roomTypes.map((rt) => (
            <option key={rt.id} value={rt.id}>
              {rt.name}
            </option>
          ))}
        </select>

        <input type="date" onChange={(e) => setStartDate(e.target.value)} />
        <input type="date" onChange={(e) => setEndDate(e.target.value)} />

        <button
          onClick={loadInventory}
          disabled={!roomTypeId || !startDate || !endDate}
          style={styles.loadBtn}
        >
          Load
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

          {rows.map((r, i) => (
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

              <span>
                <input
                  type="number"
                  value={r.totalRooms}
                  onChange={(e) => updateRow(i, "totalRooms", e.target.value)}
                />
                <small
                  style={{ display: "block", color: "#777", marginTop: 2 }}
                >
                  Max Guests: {selectedRoomType?.maxGuests}
                </small>
              </span>

              <span>
                <input
                  type="number"
                  value={r.pricePerNight}
                  onChange={(e) =>
                    updateRow(i, "pricePerNight", e.target.value)
                  }
                />
              </span>

              <span
                style={{
                  fontWeight: 600,
                  color: r.published ? "#2e7d32" : "#f57c00",
                }}
              >
                {r.published ? "PUBLISHED" : "DRAFT"}
              </span>

              <span>
                {!r.published && (
                  <button
                    onClick={() => publishRow(i)}
                    style={{ ...styles.saveBtn, background: "#f57c00" }}
                  >
                    {r.isSaving ? "Publishing…" : "Publish"}
                  </button>
                )}

                {r.published && r.isDirty && (
                  <button onClick={() => saveRow(i)} style={styles.saveBtn}>
                    {r.isSaving ? "Saving…" : "Update"}
                  </button>
                )}

                {r.published && (
                  <button
                    onClick={() => toggleStatus(i)}
                    style={styles.blockBtn}
                  >
                    {r.active ? "Block" : "Unblock"}
                  </button>
                )}
              </span>
            </div>
          ))}
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
    padding: 24,
  },
  filterBar: {
    display: "flex",
    gap: 12,
    marginBottom: 20,
  },
  loadBtn: {
    background: "#6A2C2C",
    color: "#fff",
    padding: "8px 18px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
  },
  table: {
    borderRadius: 10,
    overflow: "hidden",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
  },
  headerRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
    padding: 12,
    fontWeight: 600,
    background: "#f4f4f4",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
    padding: 12,
    alignItems: "center",
    borderBottom: "1px solid #eee",
  },
  saveBtn: {
    marginRight: 6,
    background: "#2e7d32",
    color: "#fff",
    border: "none",
    padding: "4px 10px",
    borderRadius: 4,
    cursor: "pointer",
  },
  blockBtn: {
    background: "#6A2C2C",
    color: "#fff",
    border: "none",
    padding: "4px 10px",
    borderRadius: 4,
    cursor: "pointer",
  },
};
