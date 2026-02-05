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

  /* ===============================
     LOAD INVENTORY
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

        // ✅ store original values
        originalTotalRooms: d.totalRooms,
        originalAvailableRooms: d.availableRooms,

        published: d.published ?? false,
        isDirty: false,
        isSaving: false,
      })),
    );

    setLoading(false);
  }

  /* ===============================
     UPDATE ROW (LOCAL ONLY)
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
     UPDATE PUBLISHED ROW
     =============================== */
  async function saveRow(index) {
    const row = rows[index];
    row.isSaving = true;
    setRows([...rows]);

    // ✅ booked must NEVER change
    const booked = row.originalTotalRooms - row.originalAvailableRooms;

    // ✅ available = new total - old booked
    const availableRooms = Math.max(0, row.totalRooms - booked);

    await fetch(`${BASE_URL}/api/admin/inventory/date`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hotelId,
        roomTypeId,
        date: row.date,
        totalRooms: row.totalRooms,
        availableRooms,
        pricePerNight: row.pricePerNight,
      }),
    });

    await loadInventory();
  }

  /* ===============================
     PUBLISH INVENTORY
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

    await loadInventory();
  }

  /* ===============================
     BLOCK / UNBLOCK
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

    await loadInventory();
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
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <button onClick={loadInventory} style={styles.loadBtn}>
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
              ? Math.max(0, r.originalTotalRooms - r.originalAvailableRooms)
              : 0;

            const available = r.published
              ? Math.max(0, r.totalRooms - booked)
              : r.totalRooms;

            return (
              <div
                key={r.date}
                style={{
                  ...styles.row,
                  background: !r.published ? "#FFF7E6" : "#EAF4FF",
                }}
              >
                <span>{r.date}</span>

                <span>
                  <input
                    type="number"
                    value={r.totalRooms}
                    onChange={(e) => updateRow(i, "totalRooms", e.target.value)}
                    style={styles.roomInput}
                  />
                  <div style={styles.capacityInfo}>
                    <div>
                      <b>Capacity:</b> {r.totalRooms}
                    </div>
                    <div>
                      <b>Booked:</b> {booked}
                    </div>
                    <div>
                      <b>Available:</b> {available}
                    </div>
                  </div>
                </span>

                <span>
                  <input
                    type="number"
                    value={r.pricePerNight}
                    onChange={(e) =>
                      updateRow(i, "pricePerNight", e.target.value)
                    }
                    style={styles.priceInput}
                  />
                </span>

                <span style={{ display: "flex", alignItems: "center" }}>
                  <span
                    style={{
                      minWidth: 130,
                      textAlign: "center",
                      padding: "8px 14px",
                      borderRadius: 20,
                      fontWeight: 600,
                      background: r.published ? "#E8F5E9" : "#FFE0B2",
                      color: r.published ? "#2E7D32" : "#EF6C00",
                    }}
                  >
                    {r.published ? "PUBLISHED" : "DRAFT"}
                  </span>
                </span>

                <div style={{ display: "flex", gap: 10 }}>
                  {!r.published && (
                    <button
                      onClick={() => publishRow(i)}
                      style={{
                        padding: "6px 16px",
                        borderRadius: 6,
                        border: "none",
                        background: "#ef6c00",
                        color: "#fff",
                        fontWeight: 600,
                      }}
                    >
                      Publish
                    </button>
                  )}

                  {r.published && r.isDirty && (
                    <button
                      onClick={() => saveRow(i)}
                      style={{
                        padding: "6px 14px",
                        borderRadius: 6,
                        border: "none",
                        background: "#2e7d32",
                        color: "#fff",
                      }}
                    >
                      Update
                    </button>
                  )}

                  {r.published && (
                    <button
                      onClick={() => toggleStatus(i)}
                      style={{
                        padding: "6px 14px",
                        borderRadius: 6,
                        border: "none",
                        background: r.active ? "#c9a44d" : "#2e7d32",
                        color: "#fff",
                      }}
                    >
                      {r.active ? "Block" : "Unblock"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export { Inventory };

const styles = {
  container: {
    padding: 28,
    background: "#f4f6f8",
    minHeight: "100vh",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  pageTitle: { fontSize: 26, fontWeight: 600 },
  pageSubTitle: { fontSize: 14, marginBottom: 20 },
  filterBar: { display: "flex", gap: 12, marginBottom: 20 },
  select: { padding: 10, borderRadius: 6 },
  loadBtn: {
    background: "#9A7838",
    color: "#fff",
    padding: "10px 22px",
    borderRadius: 6,
    border: "none",
  },
  table: { borderRadius: 12, background: "#fff" },
  headerRow: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr 1fr 1fr 1.4fr",
    padding: 14,
    fontWeight: 600,
  },
  row: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr 1fr 1fr 1.4fr",
    padding: 16,
    alignItems: "center",
  },
  roomInput: { width: 90, height: 36, borderRadius: 8 },
  priceInput: { width: 120, height: 36, borderRadius: 8 },
  capacityInfo: { fontSize: 12, marginTop: 6 },
  statusBadge: {
    padding: "6px 16px",
    borderRadius: 999,
    fontWeight: 700,
    textAlign: "center",
  },
  actions: { display: "flex", gap: 10 },
  publishBtn: { background: "#EF6C00", color: "#fff", borderRadius: 8 },
  updateBtn: { background: "#2E7D32", color: "#fff", borderRadius: 8 },
  blockBtn: { color: "#fff", borderRadius: 8 },
};
