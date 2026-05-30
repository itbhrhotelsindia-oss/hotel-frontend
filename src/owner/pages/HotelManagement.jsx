import React, { useEffect, useState } from "react";

export function HotelManagement() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const token = localStorage.getItem("token");

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    basicInfo: { name: "", city: "", state: "", address: "" },
    hotelSlider: [{ title: "", subtitle: "", imageUrl: "", imageId: "" }],
    services: [],
    about: { title: "", description: "" },
    amenities: [{ title: "", description: "" }],
    gallery: [],
    policies: {
      checkInTime: "2:00 PM",
      checkOutTime: "11:00 AM",
      cancellationPolicy: "",
      petsAllowed: false,
    },
    location: { mapUrl: "", attractions: [] },
    faqs: [{ question: "", answer: "" }],
    isActive: true,
  });

  useEffect(() => {
    loadHotels();
  }, []);

  const loadHotels = async () => {
    try {
      if (!token) {
        setError("Please login first");
        setLoading(false);
        return;
      }
      const res = await fetch(`${BASE_URL}/api/hotel-details`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      // Convert single hotelSlider to array for consistent frontend handling
      const convertedData = Array.isArray(data)
        ? data.map((h) => ({
            ...h,
            hotelSlider: h.hotelSlider ? [h.hotelSlider] : [],
          }))
        : [];

      setHotels(convertedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHotel = () => {
    setFormData({
      basicInfo: { name: "", city: "", state: "", address: "" },
      hotelSlider: [{ title: "", subtitle: "", imageUrl: "", imageId: "" }],
      services: [],
      about: { title: "", description: "" },
      amenities: [{ title: "", description: "" }],
      gallery: [],
      policies: {
        checkInTime: "2:00 PM",
        checkOutTime: "11:00 AM",
        cancellationPolicy: "",
        petsAllowed: false,
      },
      location: { mapUrl: "", attractions: [] },
      faqs: [{ question: "", answer: "" }],
      isActive: true,
    });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (hotel) => {
    // Ensure hotelSlider is an array
    const editData = {
      ...hotel,
      hotelSlider: Array.isArray(hotel.hotelSlider)
        ? hotel.hotelSlider
        : [
            hotel.hotelSlider || {
              title: "",
              subtitle: "",
              imageUrl: "",
              imageId: "",
            },
          ],
    };
    console.log("Editing hotel:", editData); // Debug log
    setFormData(editData);
    setEditingId(hotel.hotelId);
    setShowForm(true);
  };

  const handleDelete = async (hotelId) => {
    if (!window.confirm("Are you sure you want to delete this hotel?")) return;
    try {
      const res = await fetch(`${BASE_URL}/api/hotel-details/${hotelId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setHotels(hotels.filter((h) => h.hotelId !== hotelId));
      }
    } catch (err) {
      alert("Error deleting hotel: " + err.message);
    }
  };

  const handleSave = async () => {
    // Validation
    if (!formData.basicInfo.name.trim()) {
      alert("Hotel name is required");
      return;
    }
    if (!formData.hotelSlider[0]?.imageUrl) {
      alert("At least one slider image with upload is required");
      return;
    }

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `${BASE_URL}/api/hotel-details/${editingId}`
        : `${BASE_URL}/api/hotel-details`;

      console.log("Saving hotel with data:", formData);

      // Backend expects hotelSlider as single object, not array
      const dataToSend = {
        ...formData,
        hotelSlider: formData.hotelSlider[0], // Send only first slider
      };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      const responseData = await res.json();
      console.log("API Response:", responseData);

      if (res.ok) {
        // Convert response back to array format for frontend
        const savedHotel = {
          ...responseData,
          hotelSlider: responseData.hotelSlider
            ? [responseData.hotelSlider]
            : [],
        };

        if (editingId) {
          setHotels(
            hotels.map((h) => (h.hotelId === editingId ? savedHotel : h)),
          );
        } else {
          setHotels([...hotels, savedHotel]);
        }
        setShowForm(false);
        alert(editingId ? "Hotel updated!" : "Hotel created!");
      } else {
        alert("Error: " + (responseData.message || "Failed to save hotel"));
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Error saving hotel: " + err.message);
    }
  };

  const handleImageUpload = async (e, fieldName, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataImg = new FormData();
    formDataImg.append("file", file);

    try {
      const res = await fetch(`${BASE_URL}/api/hotel-details/upload-image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formDataImg,
      });

      const data = await res.json();
      if (fieldName === "slider") {
        const newSlider = [...formData.hotelSlider];
        newSlider[index] = {
          ...newSlider[index],
          imageUrl: data.url,
          imageId: data.fileId,
        };
        setFormData({ ...formData, hotelSlider: newSlider });
      } else if (fieldName === "gallery") {
        setFormData({
          ...formData,
          gallery: [
            ...formData.gallery,
            { imageUrl: data.url, imageId: data.fileId },
          ],
        });
      }
    } catch (err) {
      alert("Image upload failed: " + err.message);
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Loading hotels...</div>;

  return (
    <div style={{ padding: 40, background: "#f4f6f8", minHeight: "100vh" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h1 style={{ margin: 0 }}>Hotel Management</h1>
        <button
          onClick={handleAddHotel}
          style={{
            padding: "10px 20px",
            background: "#c9a44d",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          + Add Hotel
        </button>
      </div>

      {error && (
        <p
          style={{
            color: "red",
            padding: 10,
            background: "#fee2e2",
            borderRadius: 4,
            marginBottom: 20,
          }}
        >
          {error}
        </p>
      )}

      {showForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            overflow: "auto",
          }}
          onClick={() => setShowForm(false)}
        >
          <div
            style={{
              background: "white",
              borderRadius: 8,
              padding: 30,
              maxWidth: 600,
              width: "90%",
              maxHeight: "90vh",
              overflow: "auto",
              margin: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{editingId ? "Edit Hotel" : "Add New Hotel"}</h2>

            {/* Basic Info */}
            <div style={{ marginBottom: 20 }}>
              <h3>Basic Information</h3>
              <input
                type="text"
                placeholder="Hotel Name"
                value={formData.basicInfo.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    basicInfo: { ...formData.basicInfo, name: e.target.value },
                  })
                }
                style={{
                  width: "100%",
                  padding: 8,
                  marginBottom: 10,
                  border: "1px solid #ddd",
                  borderRadius: 4,
                  boxSizing: "border-box",
                }}
              />
              <input
                type="text"
                placeholder="City"
                value={formData.basicInfo.city}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    basicInfo: { ...formData.basicInfo, city: e.target.value },
                  })
                }
                style={{
                  width: "100%",
                  padding: 8,
                  marginBottom: 10,
                  border: "1px solid #ddd",
                  borderRadius: 4,
                  boxSizing: "border-box",
                }}
              />
              <input
                type="text"
                placeholder="State"
                value={formData.basicInfo.state}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    basicInfo: { ...formData.basicInfo, state: e.target.value },
                  })
                }
                style={{
                  width: "100%",
                  padding: 8,
                  marginBottom: 10,
                  border: "1px solid #ddd",
                  borderRadius: 4,
                  boxSizing: "border-box",
                }}
              />
              <textarea
                placeholder="Address"
                value={formData.basicInfo.address}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    basicInfo: {
                      ...formData.basicInfo,
                      address: e.target.value,
                    },
                  })
                }
                style={{
                  width: "100%",
                  padding: 8,
                  marginBottom: 10,
                  border: "1px solid #ddd",
                  borderRadius: 4,
                  minHeight: 60,
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Slider Images */}
            <div style={{ marginBottom: 20 }}>
              <h3>Slider Images</h3>
              {formData.hotelSlider.map((slide, idx) => (
                <div
                  key={idx}
                  style={{
                    marginBottom: 15,
                    padding: 10,
                    background: "#f9f9f9",
                    borderRadius: 4,
                  }}
                >
                  <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                    <input
                      type="text"
                      placeholder="Slide Title"
                      value={slide.title}
                      onChange={(e) => {
                        const newSlider = [...formData.hotelSlider];
                        newSlider[idx].title = e.target.value;
                        setFormData({ ...formData, hotelSlider: newSlider });
                      }}
                      style={{
                        flex: 1,
                        padding: 8,
                        border: "1px solid #ddd",
                        borderRadius: 4,
                      }}
                    />
                    {formData.hotelSlider.length > 1 && (
                      <button
                        onClick={() => {
                          const newSlider = formData.hotelSlider.filter(
                            (_, i) => i !== idx,
                          );
                          setFormData({ ...formData, hotelSlider: newSlider });
                        }}
                        style={{
                          padding: "6px 10px",
                          background: "#fee2e2",
                          color: "#b91c1c",
                          border: "none",
                          borderRadius: 4,
                          cursor: "pointer",
                          fontSize: 12,
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Slide Subtitle"
                    value={slide.subtitle}
                    onChange={(e) => {
                      const newSlider = [...formData.hotelSlider];
                      newSlider[idx].subtitle = e.target.value;
                      setFormData({ ...formData, hotelSlider: newSlider });
                    }}
                    style={{
                      width: "100%",
                      padding: 8,
                      marginBottom: 8,
                      border: "1px solid #ddd",
                      borderRadius: 4,
                      boxSizing: "border-box",
                    }}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "slider", idx)}
                    style={{ marginBottom: 8 }}
                  />
                  {slide.imageUrl && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 12,
                        color: "#666",
                      }}
                    >
                      <span>✓ Image uploaded</span>
                      <button
                        onClick={() => {
                          const newSlider = [...formData.hotelSlider];
                          newSlider[idx].imageUrl = "";
                          newSlider[idx].imageId = "";
                          setFormData({ ...formData, hotelSlider: newSlider });
                        }}
                        style={{
                          padding: "2px 6px",
                          background: "#fee2e2",
                          color: "#b91c1c",
                          border: "none",
                          borderRadius: 2,
                          cursor: "pointer",
                          fontSize: 10,
                        }}
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>
              ))}
              <button
                onClick={() =>
                  setFormData({
                    ...formData,
                    hotelSlider: [
                      ...formData.hotelSlider,
                      { title: "", subtitle: "", imageUrl: "", imageId: "" },
                    ],
                  })
                }
                style={{
                  padding: "6px 10px",
                  background: "#e5e7eb",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  marginTop: 8,
                }}
              >
                + Add Slider Image
              </button>
            </div>

            {/* Amenities */}
            <div style={{ marginBottom: 20 }}>
              <h3>Amenities</h3>
              {formData.amenities.map((amenity, idx) => (
                <div
                  key={idx}
                  style={{ marginBottom: 10, display: "flex", gap: 8 }}
                >
                  <input
                    type="text"
                    placeholder="Amenity Title"
                    value={amenity.title}
                    onChange={(e) => {
                      const newAmenities = [...formData.amenities];
                      newAmenities[idx].title = e.target.value;
                      setFormData({ ...formData, amenities: newAmenities });
                    }}
                    style={{
                      flex: 1,
                      padding: 8,
                      border: "1px solid #ddd",
                      borderRadius: 4,
                    }}
                  />
                  <button
                    onClick={() => {
                      const newAmenities = formData.amenities.filter(
                        (_, i) => i !== idx,
                      );
                      setFormData({ ...formData, amenities: newAmenities });
                    }}
                    style={{
                      padding: "6px 10px",
                      background: "#fee2e2",
                      color: "#b91c1c",
                      border: "none",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={() =>
                  setFormData({
                    ...formData,
                    amenities: [
                      ...formData.amenities,
                      { title: "", description: "" },
                    ],
                  })
                }
                style={{
                  padding: "6px 10px",
                  background: "#e5e7eb",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  marginTop: 8,
                }}
              >
                + Add Amenity
              </button>
            </div>

            {/* Policies */}
            <div style={{ marginBottom: 20 }}>
              <h3>Policies</h3>
              <input
                type="time"
                value={formData.policies.checkInTime}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    policies: {
                      ...formData.policies,
                      checkInTime: e.target.value,
                    },
                  })
                }
                style={{
                  width: "100%",
                  padding: 8,
                  marginBottom: 8,
                  border: "1px solid #ddd",
                  borderRadius: 4,
                  boxSizing: "border-box",
                }}
              />
              <input
                type="time"
                value={formData.policies.checkOutTime}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    policies: {
                      ...formData.policies,
                      checkOutTime: e.target.value,
                    },
                  })
                }
                style={{
                  width: "100%",
                  padding: 8,
                  marginBottom: 8,
                  border: "1px solid #ddd",
                  borderRadius: 4,
                  boxSizing: "border-box",
                }}
              />
              <textarea
                placeholder="Cancellation Policy"
                value={formData.policies.cancellationPolicy}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    policies: {
                      ...formData.policies,
                      cancellationPolicy: e.target.value,
                    },
                  })
                }
                style={{
                  width: "100%",
                  padding: 8,
                  marginBottom: 8,
                  border: "1px solid #ddd",
                  borderRadius: 4,
                  minHeight: 60,
                  boxSizing: "border-box",
                }}
              />
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={formData.policies.petsAllowed}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      policies: {
                        ...formData.policies,
                        petsAllowed: e.target.checked,
                      },
                    })
                  }
                />
                Pets Allowed
              </label>
            </div>

            {/* Status */}
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                />
                Active
              </label>
            </div>

            {/* Buttons */}
            <div
              style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}
            >
              <button
                onClick={() => setShowForm(false)}
                style={{
                  padding: "10px 20px",
                  background: "#e5e7eb",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                style={{
                  padding: "10px 20px",
                  background: "#c9a44d",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                Save Hotel
              </button>
            </div>
          </div>
        </div>
      )}

      {hotels.length === 0 ? (
        <p
          style={{
            background: "white",
            padding: 20,
            borderRadius: 8,
            textAlign: "center",
          }}
        >
          No hotels yet. Click "+ Add Hotel" to create your first hotel.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gap: 20,
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          }}
        >
          {hotels.map((h) => (
            <div
              key={h.hotelId}
              style={{
                background: "white",
                padding: 20,
                borderRadius: 8,
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <h3 style={{ margin: "0 0 8px 0" }}>{h.basicInfo?.name}</h3>
              <p style={{ margin: "4px 0", fontSize: 14, color: "#666" }}>
                {h.basicInfo?.city}, {h.basicInfo?.state}
              </p>
              <p style={{ margin: "4px 0", fontSize: 12, color: "#999" }}>
                {h.basicInfo?.address}
              </p>
              <p
                style={{
                  margin: "8px 0 0 0",
                  fontSize: 12,
                  color: h.isActive ? "#22c55e" : "#ef4444",
                }}
              >
                Status: {h.isActive ? "Active" : "Inactive"}
              </p>
              <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                <button
                  onClick={() => handleEdit(h)}
                  style={{
                    flex: 1,
                    padding: "6px 12px",
                    background: "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                    fontSize: 12,
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(h.hotelId)}
                  style={{
                    flex: 1,
                    padding: "6px 12px",
                    background: "#fee2e2",
                    color: "#b91c1c",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                    fontSize: 12,
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HotelManagement;
