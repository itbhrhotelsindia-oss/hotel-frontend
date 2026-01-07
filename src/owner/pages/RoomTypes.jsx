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
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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

  /* ================= SAVE (ADD / EDIT) ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const isEdit = Boolean(editing);
    const url = isEdit
      ? `${BASE_URL}/api/admin/room-types/${editing.id}`
      : `${BASE_URL}/api/admin/room-types`;

    const method = isEdit ? "PUT" : "POST";

    const payload = {
      hotelId,
      name: form.name,
      description: form.description,
      maxGuests: Number(form.maxGuests),
      basePrice: Number(form.basePrice),
    };

    const res = await fetch(url, {
      method,
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
    setForm({
      name: "",
      description: "",
      maxGuests: "",
      basePrice: "",
    });

    loadRoomTypes();
  };

  /* ================= DELETE ================= */
  const deleteRoomType = async (id) => {
    if (!confirm("Disable this room type?")) return;

    const res = await fetch(`${BASE_URL}/api/admin/room-types/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      alert("Delete failed");
      return;
    }

    loadRoomTypes();
  };

  /* ================= UI ================= */
  if (loading) return <h3>Loading room types…</h3>;
  if (error) return <h3 style={{ color: "red" }}>{error}</h3>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Room Types</h2>
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

      <div style={styles.grid}>
        {roomTypes.map((rt) => (
          <div key={rt.id} style={styles.card}>
            <h3>{rt.name}</h3>
            <p>Max Guests: {rt.maxGuests}</p>
            <p>
              <strong>Base Price:</strong> ₹{rt.basePrice}
            </p>

            <div style={styles.actions}>
              <button
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
              <button onClick={() => deleteRoomType(rt.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div style={styles.overlay}>
          <form style={styles.modal} onSubmit={handleSubmit}>
            <h3>{editing ? "Edit Room Type" : "Add Room Type"}</h3>

            <input
              placeholder="Room Type Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />

            <input
              placeholder="Description"
              value={form.description}
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
              <button type="button" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

/* ✅ NAMED EXPORT */
export { RoomTypes };

/* ================= STYLES ================= */

const styles = {
  container: { padding: 24 },
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: 16,
  },
  card: {
    background: "#fff",
    padding: 16,
    borderRadius: 8,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
  actions: {
    display: "flex",
    gap: 8,
    marginTop: 10,
  },
  primaryBtn: {
    background: "#6A2C2C",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: 4,
    cursor: "pointer",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    background: "#fff",
    padding: 20,
    borderRadius: 8,
    minWidth: 320,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  modalActions: {
    display: "flex",
    justifyContent: "space-between",
  },
};
