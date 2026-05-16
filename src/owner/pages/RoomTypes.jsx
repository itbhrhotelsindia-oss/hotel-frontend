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
    imageFiles: [],
    uploadedImages: [],
    amenities: "",
    maxAdults: "",
    maxChildren: "",
    basePrice: "",
    breakfastPrice: "",
    lunchDinnerPrice: "",
    payAtHotelMarkupPercent: "",
  });

  /* ================= LOAD ROOM TYPES ================= */
  const loadRoomTypes = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${BASE_URL}/api/admin/room-types?hotelId=${hotelId}`,
        { headers: { Authorization: `Bearer ${token}` } },
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

  /* ================= HANDLE FILE UPLOAD ================= */
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setLoading(true);
    const uploadedUrls = [];

    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(
          `${BASE_URL}/api/admin/room-types/${hotelId}/upload-image`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          },
        );

        if (res.ok) {
          const data = await res.json();
          uploadedUrls.push(data.url);
        } else {
          console.error("Image upload failed for", file.name);
        }
      } catch (err) {
        console.error("Upload error:", err);
      }
    }

    setForm({
      ...form,
      uploadedImages: [...form.uploadedImages, ...uploadedUrls],
    });
    setLoading(false);
  };

  /* ================= REMOVE UPLOADED IMAGE ================= */
  const removeImage = (index) => {
    const newImages = form.uploadedImages.filter((_, i) => i !== index);
    setForm({ ...form, uploadedImages: newImages });
  };

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
      images: form.uploadedImages,
      amenities: form.amenities
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      maxAdults: Number(form.maxAdults),
      maxChildren: Number(form.maxChildren),
      basePrice: Number(form.basePrice),
      breakfastPrice: Number(form.breakfastPrice),
      lunchDinnerPrice: Number(form.lunchDinnerPrice),
      payAtHotelMarkupPercent: Number(form.payAtHotelMarkupPercent),
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
    resetForm();
    loadRoomTypes();
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      imageFiles: [],
      uploadedImages: [],
      amenities: "",
      maxAdults: "",
      maxChildren: "",
      basePrice: "",
      breakfastPrice: "",
      lunchDinnerPrice: "",
      payAtHotelMarkupPercent: "",
    });
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
            resetForm();
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
            {rt.images?.length ? (
              <img src={rt.images[0]} alt={rt.name} style={styles.cardImage} />
            ) : null}
            <h3 style={styles.cardTitle}>{rt.name}</h3>
            {rt.description && <p style={styles.cardDesc}>{rt.description}</p>}
            {rt.amenities?.length ? (
              <div style={styles.amenitiesRow}>
                {rt.amenities.map((amenity) => (
                  <span key={amenity} style={styles.amenityBadge}>
                    {amenity}
                  </span>
                ))}
              </div>
            ) : null}

            <div style={styles.metaCol}>
              <div>👨 Adults: {rt.maxAdults}</div>
              <div>🧒 Children: {rt.maxChildren}</div>
              <div>💰 Base: ₹{rt.basePrice}</div>
              <div>🥞 Breakfast: ₹{rt.breakfastPrice}</div>
              <div>🍽 Meals: ₹{rt.lunchDinnerPrice}</div>
              <div>🏨 Pay@Hotel Markup: {rt.payAtHotelMarkupPercent}%</div>
            </div>

            <div style={styles.actions}>
              <button
                style={styles.secondaryBtn}
                onClick={() => {
                  setEditing(rt);
                  setForm({
                    name: rt.name,
                    description: rt.description || "",
                    imageFiles: [],
                    uploadedImages: rt.images || [],
                    amenities: (rt.amenities || []).join(", "),
                    maxAdults: rt.maxAdults,
                    maxChildren: rt.maxChildren,
                    basePrice: rt.basePrice,
                    breakfastPrice: rt.breakfastPrice,
                    lunchDinnerPrice: rt.lunchDinnerPrice,
                    payAtHotelMarkupPercent: rt.payAtHotelMarkupPercent,
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

            {renderInput("Room Type Name", "name")}
            {renderTextarea("Description", "description")}
            {/* IMAGE UPLOAD */}
            <div style={styles.field}>
              <label style={styles.label}>Room Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                style={styles.fileInput}
              />
              <p style={styles.helpText}>
                Upload high-quality room photos (JPG, PNG)
              </p>
              {form.uploadedImages.length > 0 && (
                <div style={styles.imagePreview}>
                  {form.uploadedImages.map((imgUrl, idx) => (
                    <div key={idx} style={styles.previewItem}>
                      <img src={imgUrl} alt="Room" style={styles.previewImg} />
                      <button
                        type="button"
                        style={styles.removeBtn}
                        onClick={() => removeImage(idx)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {renderTextarea("Amenities (comma separated)", "amenities")}
            {renderInput("Max Adults", "maxAdults", "number")}
            {renderInput("Max Children", "maxChildren", "number")}
            {renderInput("Base Price (₹)", "basePrice", "number")}
            {renderInput("Breakfast Price (₹)", "breakfastPrice", "number")}
            {renderInput(
              "Lunch + Dinner Price (₹)",
              "lunchDinnerPrice",
              "number",
            )}
            {renderInput(
              "Pay at Hotel Markup (%)",
              "payAtHotelMarkupPercent",
              "number",
            )}

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

  function renderInput(label, key, type = "text") {
    return (
      <div style={styles.field}>
        <label style={styles.label}>{label}</label>
        <input
          type={type}
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          required
          style={styles.input}
        />
      </div>
    );
  }

  function renderTextarea(label, key) {
    return (
      <div style={styles.field}>
        <label style={styles.label}>{label}</label>
        <textarea
          rows={3}
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          style={styles.input}
        />
      </div>
    );
  }
};

export { RoomTypes };

/* ================= STYLES ================= */

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
    marginBottom: 24,
  },
  title: { fontSize: 26, fontWeight: 600 },
  subtitle: { fontSize: 13, color: "#6b7280" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: 20,
  },
  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 8px 22px rgba(0,0,0,0.06)",
  },
  cardTitle: { fontSize: 18, fontWeight: 600 },
  cardDesc: { fontSize: 14, color: "#6b7280" },
  metaCol: { fontSize: 13, marginTop: 10, lineHeight: "20px" },
  actions: { display: "flex", gap: 10, marginTop: 12 },
  primaryBtn: {
    background: "#c9a44d",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: 6,
    cursor: "pointer",
  },
  secondaryBtn: {
    background: "#e5e7eb",
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
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    background: "#fff",
    padding: 24,
    borderRadius: 12,
    width: "90%",
    maxWidth: 500,
    maxHeight: "90vh",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  modalTitle: { fontSize: 18, fontWeight: 600 },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 10,
  },
  cardImage: {
    width: "100%",
    height: 180,
    objectFit: "cover",
    borderRadius: 12,
    marginBottom: 16,
  },
  amenitiesRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },
  amenityBadge: {
    fontSize: 12,
    background: "#f3f4f6",
    padding: "6px 10px",
    borderRadius: 999,
    color: "#374151",
  },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 13, color: "#374151", fontWeight: 600 },
  input: {
    padding: "12px 14px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    fontSize: "14px",
    fontFamily: "system-ui, sans-serif",
    backgroundColor: "#fafbfc",
  },
  fileInput: {
    padding: "12px 14px",
    borderRadius: 8,
    border: "2px dashed #d1d5db",
    fontSize: "14px",
    fontFamily: "system-ui, sans-serif",
    cursor: "pointer",
  },
  helpText: {
    fontSize: "12px",
    color: "#6b7280",
    marginTop: "4px",
  },
  imagePreview: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginTop: "12px",
    paddingTop: "12px",
    borderTop: "1px solid #e5e7eb",
  },
  previewItem: {
    position: "relative",
    width: "100px",
    height: "100px",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  previewImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  removeBtn: {
    position: "absolute",
    top: "2px",
    right: "2px",
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: "24px",
    height: "24px",
    fontSize: "16px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0",
  },
};
