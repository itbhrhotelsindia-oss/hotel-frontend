import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const RoomTypes = () => {
  const { hotelId } = useParams();
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const token = localStorage.getItem("token");

  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    maxGuests: "",
    basePrice: "",
  });

  /* ================= LOAD ROOM TYPES ================= */
  const loadRoomTypes = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${BASE_URL}/api/admin/room-types?hotelId=${hotelId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) throw new Error("Failed to load room types");

      const data = await res.json();
      setRoomTypes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoomTypes();
  }, [hotelId]);

  /* ================= SAVE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const isEdit = Boolean(editing);
    const url = isEdit
      ? `${BASE_URL}/api/admin/room-types/${editing.id}`
      : `${BASE_URL}/api/admin/room-types`;

    const payload = {
      hotelId,
      name: form.name,
      description: form.description,
      maxGuests: Number(form.maxGuests),
      basePrice: Number(form.basePrice),
    };

    const res = await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      alert("Save failed");
      return;
    }

    setShowForm(false);
    setEditing(null);
    setForm({ name: "", description: "", maxGuests: "", basePrice: "" });
    loadRoomTypes();
  };

  /* ================= DELETE ================= */
  const deleteRoomType = async (id) => {
    if (!confirm("Disable this room type?")) return;

    await fetch(`${BASE_URL}/api/admin/room-types/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    loadRoomTypes();
  };

  /* ================= UI ================= */
  if (loading) return <h3>Loading room types…</h3>;
  if (error) return <h3 style={{ color: "red" }}>{error}</h3>;

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Room Types</h2>
          <p style={styles.subtitle}>Hotel ID: {hotelId}</p>
        </div>

        <button
          style={styles.primaryBtn}
          onClick={() => {
            setEditing(null);
            setForm({
              name: "",
              description: "",
              maxGuests: "",
              basePrice: "",
            });
            setShowForm(true);
          }}
        >
          + Add Room Type
        </button>
      </div>

      {/* ROOM TYPE CARDS */}
      <div style={styles.grid}>
        {roomTypes.map((rt) => (
          <div key={rt.id} style={styles.card}>
            <h3 style={styles.cardTitle}>{rt.name}</h3>

            {rt.description && <p style={styles.cardDesc}>{rt.description}</p>}

            <div style={styles.meta}>
              <span>👥 Max Adults: {rt.maxGuests}</span>
              <span>💰 ₹{rt.basePrice} / night</span>
            </div>

            <div style={styles.actions}>
              <button
                style={styles.secondaryBtn}
                onClick={() => {
                  setEditing(rt);
                  setForm({
                    name: rt.name,
                    description: rt.description || "",
                    maxGuests: rt.maxGuests,
                    basePrice: rt.basePrice,
                  });
                  setShowForm(true);
                }}
              >
                Edit
              </button>

              <button
                style={styles.dangerBtn}
                onClick={() => deleteRoomType(rt.id)}
              >
                Disable
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {showForm && (
        <div style={styles.overlay}>
          <form style={styles.modal} onSubmit={handleSubmit}>
            <h3 style={styles.modalTitle}>
              {editing ? "Edit Room Type" : "Add Room Type"}
            </h3>

            <input
              placeholder="Room Type Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />

            <textarea
              placeholder="Description (optional)"
              value={form.description}
              rows={3}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Max Guests"
              value={form.maxGuests}
              onChange={(e) => setForm({ ...form, maxGuests: e.target.value })}
              required
            />

            <input
              type="number"
              placeholder="Base Price"
              value={form.basePrice}
              onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
              required
            />

            <div style={styles.modalActions}>
              <button type="submit" style={styles.primaryBtn}>
                Save
              </button>
              <button
                type="button"
                style={styles.secondaryBtn}
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export { RoomTypes };

const styles = {
  page: {
    padding: 32,
    background: "#f4f6f8",
    minHeight: "100vh",
    fontFamily: "Inter, system-ui, sans-serif",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  title: {
    fontSize: 26,
    fontWeight: 600,
    color: "#1f2937",
  },

  subtitle: {
    fontSize: 13,
    color: "#6b7280",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 20,
  },

  card: {
    background: "#ffffff",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 8px 22px rgba(0,0,0,0.06)",
    transition: "transform 0.2s ease",
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 6,
  },

  cardDesc: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 10,
  },

  meta: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 13,
    color: "#374151",
    marginBottom: 14,
  },

  actions: {
    display: "flex",
    gap: 10,
  },

  primaryBtn: {
    background: "#c9a44d",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: 500,
  },

  secondaryBtn: {
    background: "#e5e7eb",
    color: "#111827",
    border: "none",
    padding: "10px 16px",
    borderRadius: 6,
    cursor: "pointer",
  },

  dangerBtn: {
    background: "#fee2e2",
    color: "#b91c1c",
    border: "none",
    padding: "10px 16px",
    borderRadius: 6,
    cursor: "pointer",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },

  modal: {
    background: "#fff",
    padding: 24,
    borderRadius: 12,
    width: 360,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 6,
  },

  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 10,
  },
};
