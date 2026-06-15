import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const SERVICES = ["MICE", "Wedding", "Vacation"];

const emptyStep2 = {
  sliderTitle: "",
  sliderSubtitle: "",
  sliderImages: [""],
  aboutTitle: "",
  aboutDescription: "",
  amenities: [""],
  galleryImages: [""],
  checkInTime: "02:00 PM",
  checkOutTime: "11:00 AM",
  petsAllowed: false,
  cancellationPolicy: "Free cancellation up to 48 hours before check-in.",
  mapEmbedUrl: "",
  nearbyAttractions: [""],
  faqs: [{ question: "", answer: "" }],
  status: "ACTIVE",
};

// ── Reusable single image upload component ───────────────────────────────────
function ImageUploadField({ value, onChange, label, baseUrl, token }) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const inputRef = useRef();

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadError("");
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`${baseUrl}/api/hotel-details/upload-image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      onChange(data.url);
    } catch (err) {
      setUploadError("Upload failed. Try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div style={uploadStyles.wrapper}>
      {label && <p style={uploadStyles.label}>{label}</p>}

      {value ? (
        <div style={uploadStyles.previewBox}>
          <img src={value} alt="preview" style={uploadStyles.preview} />
          <button style={uploadStyles.changeBtn} onClick={() => inputRef.current.click()} disabled={uploading}>
            {uploading ? "Uploading..." : "Change Image"}
          </button>
          <button style={uploadStyles.removeBtn} onClick={() => onChange("")}>✕ Remove</button>
        </div>
      ) : (
        <div style={uploadStyles.dropZone} onClick={() => inputRef.current.click()}>
          {uploading ? (
            <p style={{ color: "#c9a44d", margin: 0 }}>Uploading...</p>
          ) : (
            <>
              <p style={{ margin: "0 0 4px", fontSize: "24px" }}>📷</p>
              <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>Click to upload image</p>
            </>
          )}
        </div>
      )}

      {uploadError && <p style={{ color: "#dc2626", fontSize: "12px", marginTop: "4px" }}>{uploadError}</p>}
      <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
    </div>
  );
}

const uploadStyles = {
  wrapper: { marginBottom: "14px" },
  label: { fontSize: "13px", fontWeight: "500", color: "#374151", marginBottom: "6px" },
  dropZone: {
    border: "2px dashed #d1d5db", borderRadius: "8px", padding: "28px",
    textAlign: "center", cursor: "pointer", background: "#fafafa",
    transition: "border-color 0.2s",
  },
  previewBox: { display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" },
  preview: { width: "120px", height: "80px", objectFit: "cover", borderRadius: "6px", border: "1px solid #e5e7eb" },
  changeBtn: { padding: "7px 14px", background: "#f3f4f6", border: "1px solid #d1d5db", borderRadius: "5px", cursor: "pointer", fontSize: "13px" },
  removeBtn: { padding: "7px 14px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "13px" },
};

// ── Main Wizard ──────────────────────────────────────────────────────────────
export default function AddHotelWizard() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [step, setStep] = useState(1);
  const [cities, setCities] = useState([]);

  // Step 1 state
  const [cityMode, setCityMode] = useState("existing");
  const [selectedCityId, setSelectedCityId] = useState("");
  const [newCityName, setNewCityName] = useState("");
  const [newCityState, setNewCityState] = useState("");
  const [newCityImage, setNewCityImage] = useState("");
  const [hotelId, setHotelId] = useState("");
  const [hotelName, setHotelName] = useState("");
  const [address, setAddress] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [services, setServices] = useState([]);

  // Step 2 state
  const [s2, setS2] = useState(emptyStep2);

  // Step 3 state
  const [ownerUsername, setOwnerUsername] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("");
  const [ownerConfirm, setOwnerConfirm] = useState("");
  const [ownerCreated, setOwnerCreated] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetch(`${BASE_URL}/api/cities/all`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setCities(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, [BASE_URL, token]);

  // ── Step 1 Submit ────────────────────────────────────────────────────────
  const submitStep1 = async () => {
    setError("");
    if (!hotelName.trim()) return setError("Hotel name is required.");
    if (!address.trim()) return setError("Address is required.");
    if (cityMode === "existing" && !selectedCityId) return setError("Please select a city.");
    if (cityMode === "new" && (!newCityName.trim() || !newCityState.trim())) return setError("City name and state are required.");

    setSubmitting(true);
    try {
      const hotelPayload = {
        // hotelId is generated by the backend — never sent from the client.
        name: hotelName.trim(),
        address: address.trim(),
        imageUrl: coverImage || "",
        services,
        active: true,
      };

      let cityId = selectedCityId;

      if (cityMode === "new") {
        const res = await fetch(`${BASE_URL}/api/cities/`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ name: newCityName.trim(), state: newCityState.trim(), cityImageUrl: newCityImage || "", hotels: [hotelPayload], active: true }),
        });
        if (!res.ok) throw new Error(await res.text());
        const created = await res.json();
        cityId = created.id;
        const savedHotel = created.hotels?.[0];
        if (savedHotel?.hotelId) setHotelId(savedHotel.hotelId);
      } else {
        const res = await fetch(`${BASE_URL}/api/cities/${cityId}/hotels`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify([hotelPayload]),
        });
        if (!res.ok) throw new Error(await res.text());
        const updated = await res.json();
        const savedHotel = updated.hotels?.find(h => h.name === hotelName.trim());
        if (savedHotel?.hotelId && !hotelId.trim()) setHotelId(savedHotel.hotelId);
      }

      setStep(2);
    } catch (e) {
      setError(e.message || "Failed to register hotel. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Step 2 Submit ────────────────────────────────────────────────────────
  const submitStep2 = async () => {
    setError("");
    if (!s2.sliderTitle.trim()) return setError("Slider title is required.");
    if (!s2.aboutDescription.trim()) return setError("About description is required.");

    setSubmitting(true);
    try {
      const selectedCity = cities.find(c => c.id === selectedCityId);
      const payload = {
        hotelId,
        basicInfo: {
          name: hotelName,
          city: cityMode === "new" ? newCityName : selectedCity?.name || "",
          state: cityMode === "new" ? newCityState : selectedCity?.state || "",
          address,
        },
        hotelSlider: {
          title: s2.sliderTitle,
          subtitle: s2.sliderSubtitle,
          images: s2.sliderImages.filter(Boolean),
        },
        services,
        aboutSection: { title: s2.aboutTitle || "About", description: s2.aboutDescription },
        roomsSection: { title: "Our Rooms", rooms: [] },
        amenitiesSection: { title: "Amenities", amenities: s2.amenities.filter(Boolean) },
        gallerySection: { images: s2.galleryImages.filter(Boolean) },
        policiesSection: { checkInTime: s2.checkInTime, checkOutTime: s2.checkOutTime, petsAllowed: s2.petsAllowed, cancellationPolicy: s2.cancellationPolicy },
        locationSection: { mapEmbedUrl: s2.mapEmbedUrl, nearbyAttractions: s2.nearbyAttractions.filter(Boolean) },
        faqSection: { faqs: s2.faqs.filter(f => f.question.trim()) },
        status: s2.status,
      };

      const res = await fetch(`${BASE_URL}/api/hotel-details`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      setStep(3);
    } catch (e) {
      setError(e.message || "Failed to save hotel details.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Step 3 Submit ────────────────────────────────────────────────────────
  const submitStep3 = async () => {
    setError("");
    if (!ownerUsername.trim()) return setError("Username is required.");
    if (ownerPassword.length < 6) return setError("Password must be at least 6 characters.");
    if (ownerPassword !== ownerConfirm) return setError("Passwords do not match.");

    setSubmitting(true);
    try {
      const res = await fetch(`${BASE_URL}/api/admin/owners`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ username: ownerUsername.trim(), password: ownerPassword, hotelIds: [hotelId] }),
      });
      if (!res.ok) throw new Error(await res.text());
      setOwnerCreated(true);
      setSuccess(`Hotel "${hotelName}" has been added successfully!`);
    } catch (e) {
      setError(e.message || "Failed to create owner account.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Helpers ──────────────────────────────────────────────────────────────
  const toggleService = (s) => setServices(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const updateSliderImage = (index, url) =>
    setS2(p => { const imgs = [...p.sliderImages]; imgs[index] = url; return { ...p, sliderImages: imgs }; });

  const updateGalleryImage = (index, url) =>
    setS2(p => { const imgs = [...p.galleryImages]; imgs[index] = url; return { ...p, galleryImages: imgs }; });

  const updateFaq = (index, field, value) =>
    setS2(prev => { const faqs = [...prev.faqs]; faqs[index] = { ...faqs[index], [field]: value }; return { ...prev, faqs }; });

  // ── Success screen ───────────────────────────────────────────────────────
  if (success) {
    return (
      <div style={styles.page}>
        <div style={styles.successBox}>
          <h2 style={{ color: "#16a34a", marginBottom: "12px" }}>Hotel Added Successfully!</h2>
          <p style={{ color: "#374151", marginBottom: "16px" }}>{success}</p>

          {/* Hotel info */}
          <div style={styles.credBox}>
            <p style={styles.credRow}><span style={styles.credLabel}>Hotel ID</span><strong>{hotelId}</strong></p>
          </div>

          {/* Owner credentials */}
          {ownerCreated && (
            <>
              <p style={{ color: "#374151", fontSize: "14px", margin: "16px 0 8px", fontWeight: "600" }}>Owner Login Credentials:</p>
              <div style={styles.credBox}>
                <p style={styles.credRow}><span style={styles.credLabel}>Login URL</span><strong>http://localhost:5173/owner/login</strong></p>
                <p style={styles.credRow}><span style={styles.credLabel}>Username</span><strong>{ownerUsername}</strong></p>
                <p style={styles.credRow}><span style={styles.credLabel}>Password</span><strong>{ownerPassword}</strong></p>
              </div>
              <p style={{ color: "#6b7280", fontSize: "12px", margin: "8px 0 16px" }}>Save these credentials — the password cannot be recovered.</p>
            </>
          )}

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "8px" }}>
            <button style={styles.primaryBtn} onClick={() => navigate("/superadmin/dashboard")}>← Back to Dashboard</button>
            <button style={styles.secondaryBtn} onClick={() => navigate(`/superadmin/hotel/${hotelId}/room-types`)}>Set Up Room Types →</button>
            {ownerCreated && (
              <button style={{ ...styles.secondaryBtn, color: "#16a34a", borderColor: "#86efac" }}
                onClick={() => {
                  localStorage.clear();
                  navigate("/owner/login");
                }}>
                Test Owner Login →
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <button style={styles.backLink} onClick={() => step > 1 ? setStep(s => s - 1) : navigate("/superadmin/dashboard")}>
          ← {step > 1 ? "Back" : "Dashboard"}
        </button>
        <h1 style={styles.title}>Add New Hotel</h1>
      </div>

      {/* STEP INDICATOR */}
      <div style={styles.steps}>
        {["Registration", "Hotel Details", "Owner Setup"].map((label, i) => (
          <div key={i} style={styles.stepItem}>
            <div style={{ ...styles.stepCircle, ...(step === i + 1 ? styles.stepActive : step > i + 1 ? styles.stepDone : {}) }}>
              {step > i + 1 ? "✓" : i + 1}
            </div>
            <span style={{ ...styles.stepLabel, ...(step === i + 1 ? { color: "#c9a44d", fontWeight: "600" } : {}) }}>{label}</span>
          </div>
        ))}
      </div>

      {error && <div style={styles.errorBox}>{error}</div>}

      {/* ── STEP 1 ── */}
      {step === 1 && (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Step 1 — Hotel Registration</h2>

          <label style={styles.label}>City</label>
          <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
            <button style={{ ...styles.toggleBtn, ...(cityMode === "existing" ? styles.toggleActive : {}) }} onClick={() => setCityMode("existing")}>Existing City</button>
            <button style={{ ...styles.toggleBtn, ...(cityMode === "new" ? styles.toggleActive : {}) }} onClick={() => setCityMode("new")}>+ New City</button>
          </div>

          {cityMode === "existing" ? (
            <select style={styles.input} value={selectedCityId} onChange={e => setSelectedCityId(e.target.value)}>
              <option value="">Select city…</option>
              {cities.map(c => <option key={c.id} value={c.id}>{c.name}, {c.state}</option>)}
            </select>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <input style={styles.input} placeholder="City name (e.g. Shravasti)" value={newCityName} onChange={e => setNewCityName(e.target.value)} />
                <input style={styles.input} placeholder="State (e.g. Uttar Pradesh)" value={newCityState} onChange={e => setNewCityState(e.target.value)} />
              </div>
              <ImageUploadField
                label="City Banner Image"
                value={newCityImage}
                onChange={setNewCityImage}
                baseUrl={BASE_URL}
                token={token}
              />
            </>
          )}

          <p style={styles.infoNote}>The Hotel ID is generated automatically once you save — it cannot be set manually, which guarantees every hotel has a unique id.</p>

          <label style={styles.label}>Hotel Name *</label>
          <input style={styles.input} placeholder="e.g. Tulip Inn" value={hotelName} onChange={e => setHotelName(e.target.value)} />

          <label style={styles.label}>Address *</label>
          <textarea style={styles.textarea} placeholder="Full address" value={address} onChange={e => setAddress(e.target.value)} rows={2} />

          <ImageUploadField
            label="Cover Image"
            value={coverImage}
            onChange={setCoverImage}
            baseUrl={BASE_URL}
            token={token}
          />

          <label style={styles.label}>Services</label>
          <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
            {SERVICES.map(s => (
              <label key={s} style={styles.checkLabel}>
                <input type="checkbox" checked={services.includes(s)} onChange={() => toggleService(s)} style={{ marginRight: "6px" }} />
                {s}
              </label>
            ))}
          </div>

          <button style={styles.primaryBtn} disabled={submitting} onClick={submitStep1}>
            {submitting ? "Saving..." : "Next: Hotel Details →"}
          </button>
        </div>
      )}

      {/* ── STEP 2 ── */}
      {step === 2 && (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Step 2 — Hotel Details</h2>
          <p style={styles.infoNote}>Hotel ID: <strong>{hotelId}</strong></p>

          {/* Slider */}
          <h3 style={styles.sectionTitle}>Hero Slider</h3>
          <label style={styles.label}>Title *</label>
          <input style={styles.input} value={s2.sliderTitle} onChange={e => setS2(p => ({ ...p, sliderTitle: e.target.value }))} placeholder="e.g. Premium Hospitality in the Heart of..." />
          <label style={styles.label}>Subtitle</label>
          <textarea style={styles.textarea} rows={3} value={s2.sliderSubtitle} onChange={e => setS2(p => ({ ...p, sliderSubtitle: e.target.value }))} />

          <label style={styles.label}>Slider Images</label>
          {s2.sliderImages.map((img, i) => (
            <div key={i} style={{ marginBottom: "12px", padding: "12px", background: "#f9fafb", borderRadius: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <span style={{ fontSize: "12px", color: "#6b7280" }}>Image {i + 1}</span>
                {s2.sliderImages.length > 1 && (
                  <button style={styles.removeBtn} onClick={() => setS2(p => ({ ...p, sliderImages: p.sliderImages.filter((_, idx) => idx !== i) }))}>✕ Remove</button>
                )}
              </div>
              <ImageUploadField
                value={img}
                onChange={(url) => updateSliderImage(i, url)}
                baseUrl={BASE_URL}
                token={token}
              />
            </div>
          ))}
          <button style={styles.addBtn} onClick={() => setS2(p => ({ ...p, sliderImages: [...p.sliderImages, ""] }))}>+ Add Slider Image</button>

          {/* About */}
          <h3 style={styles.sectionTitle}>About Section</h3>
          <label style={styles.label}>Title</label>
          <input style={styles.input} value={s2.aboutTitle} onChange={e => setS2(p => ({ ...p, aboutTitle: e.target.value }))} placeholder="About the hotel" />
          <label style={styles.label}>Description *</label>
          <textarea style={styles.textarea} rows={4} value={s2.aboutDescription} onChange={e => setS2(p => ({ ...p, aboutDescription: e.target.value }))} />

          {/* Amenities */}
          <h3 style={styles.sectionTitle}>Amenities</h3>
          {s2.amenities.map((a, i) => (
            <div key={i} style={styles.listRow}>
              <input style={{ ...styles.input, flex: 1, marginBottom: 0 }} placeholder="e.g. Swimming Pool" value={a}
                onChange={e => setS2(p => { const am = [...p.amenities]; am[i] = e.target.value; return { ...p, amenities: am }; })} />
              {s2.amenities.length > 1 && (
                <button style={styles.removeBtn} onClick={() => setS2(p => ({ ...p, amenities: p.amenities.filter((_, idx) => idx !== i) }))}>✕</button>
              )}
            </div>
          ))}
          <button style={styles.addBtn} onClick={() => setS2(p => ({ ...p, amenities: [...p.amenities, ""] }))}>+ Add Amenity</button>

          {/* Gallery */}
          <h3 style={styles.sectionTitle}>Gallery Images</h3>
          {s2.galleryImages.map((img, i) => (
            <div key={i} style={{ marginBottom: "12px", padding: "12px", background: "#f9fafb", borderRadius: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <span style={{ fontSize: "12px", color: "#6b7280" }}>Gallery Image {i + 1}</span>
                {s2.galleryImages.length > 1 && (
                  <button style={styles.removeBtn} onClick={() => setS2(p => ({ ...p, galleryImages: p.galleryImages.filter((_, idx) => idx !== i) }))}>✕ Remove</button>
                )}
              </div>
              <ImageUploadField
                value={img}
                onChange={(url) => updateGalleryImage(i, url)}
                baseUrl={BASE_URL}
                token={token}
              />
            </div>
          ))}
          <button style={styles.addBtn} onClick={() => setS2(p => ({ ...p, galleryImages: [...p.galleryImages, ""] }))}>+ Add Gallery Image</button>

          {/* Policies */}
          <h3 style={styles.sectionTitle}>Policies</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div><label style={styles.label}>Check-in Time</label><input style={styles.input} value={s2.checkInTime} onChange={e => setS2(p => ({ ...p, checkInTime: e.target.value }))} /></div>
            <div><label style={styles.label}>Check-out Time</label><input style={styles.input} value={s2.checkOutTime} onChange={e => setS2(p => ({ ...p, checkOutTime: e.target.value }))} /></div>
          </div>
          <label style={styles.label}>Cancellation Policy</label>
          <input style={styles.input} value={s2.cancellationPolicy} onChange={e => setS2(p => ({ ...p, cancellationPolicy: e.target.value }))} />
          <label style={styles.checkLabel}>
            <input type="checkbox" checked={s2.petsAllowed} onChange={e => setS2(p => ({ ...p, petsAllowed: e.target.checked }))} style={{ marginRight: "6px" }} />
            Pets Allowed
          </label>

          {/* Location */}
          <h3 style={styles.sectionTitle}>Location</h3>
          <label style={styles.label}>Google Maps Embed URL</label>
          <input style={styles.input} value={s2.mapEmbedUrl} onChange={e => setS2(p => ({ ...p, mapEmbedUrl: e.target.value }))} placeholder="https://maps.google.com/..." />
          <label style={styles.label}>Nearby Attractions</label>
          {s2.nearbyAttractions.map((a, i) => (
            <div key={i} style={styles.listRow}>
              <input style={{ ...styles.input, flex: 1, marginBottom: 0 }} placeholder="e.g. Jim Corbett National Park" value={a}
                onChange={e => setS2(p => { const na = [...p.nearbyAttractions]; na[i] = e.target.value; return { ...p, nearbyAttractions: na }; })} />
              {s2.nearbyAttractions.length > 1 && (
                <button style={styles.removeBtn} onClick={() => setS2(p => ({ ...p, nearbyAttractions: p.nearbyAttractions.filter((_, idx) => idx !== i) }))}>✕</button>
              )}
            </div>
          ))}
          <button style={styles.addBtn} onClick={() => setS2(p => ({ ...p, nearbyAttractions: [...p.nearbyAttractions, ""] }))}>+ Add Attraction</button>

          {/* FAQs */}
          <h3 style={styles.sectionTitle}>FAQs</h3>
          {s2.faqs.map((faq, i) => (
            <div key={i} style={{ padding: "14px", marginBottom: "10px", background: "#f9fafb", borderRadius: "8px" }}>
              <input style={styles.input} placeholder="Question" value={faq.question} onChange={e => updateFaq(i, "question", e.target.value)} />
              <textarea style={styles.textarea} rows={2} placeholder="Answer" value={faq.answer} onChange={e => updateFaq(i, "answer", e.target.value)} />
              {s2.faqs.length > 1 && (
                <button style={styles.removeBtn} onClick={() => setS2(p => ({ ...p, faqs: p.faqs.filter((_, idx) => idx !== i) }))}>Remove FAQ</button>
              )}
            </div>
          ))}
          <button style={styles.addBtn} onClick={() => setS2(p => ({ ...p, faqs: [...p.faqs, { question: "", answer: "" }] }))}>+ Add FAQ</button>

          {/* Status */}
          <h3 style={styles.sectionTitle}>Status</h3>
          <select style={styles.input} value={s2.status} onChange={e => setS2(p => ({ ...p, status: e.target.value }))}>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>

          <button style={styles.primaryBtn} disabled={submitting} onClick={submitStep2}>
            {submitting ? "Saving..." : "Next: Owner Setup →"}
          </button>
        </div>
      )}

      {/* ── STEP 3 ── */}
      {step === 3 && (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Step 3 — Owner Setup</h2>
          <p style={styles.infoNote}>Create login credentials for the hotel owner. They will use this to manage room types and inventory.</p>

          <label style={styles.label}>Hotel ID (auto-linked)</label>
          <input style={{ ...styles.input, background: "#f3f4f6", color: "#6b7280" }} value={hotelId} readOnly />

          <label style={styles.label}>Owner Username *</label>
          <input style={styles.input} placeholder="e.g. tulip_owner" value={ownerUsername} onChange={e => setOwnerUsername(e.target.value)} />

          <label style={styles.label}>Password * (min 6 characters)</label>
          <input type="password" style={styles.input} value={ownerPassword} onChange={e => setOwnerPassword(e.target.value)} />

          <label style={styles.label}>Confirm Password *</label>
          <input type="password" style={styles.input} value={ownerConfirm} onChange={e => setOwnerConfirm(e.target.value)} />

          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            <button style={styles.secondaryBtn} disabled={submitting} onClick={submitStep3}>
              {submitting ? "Creating..." : "Create Owner & Finish"}
            </button>
            <button style={styles.skipBtn} onClick={() => setSuccess(`Hotel "${hotelName}" has been added. Owner setup skipped.`)}>
              Skip Owner Setup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { padding: "32px", minHeight: "100vh", background: "#f4f6f8", fontFamily: "Inter, system-ui, sans-serif", maxWidth: "760px", margin: "0 auto" },
  header: { display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" },
  backLink: { background: "none", border: "none", color: "#6b7280", cursor: "pointer", fontSize: "14px", padding: 0 },
  title: { fontSize: "24px", fontWeight: "700", color: "#111827", margin: 0 },
  steps: { display: "flex", gap: "32px", marginBottom: "28px", alignItems: "center" },
  stepItem: { display: "flex", alignItems: "center", gap: "8px" },
  stepCircle: { width: "30px", height: "30px", borderRadius: "50%", background: "#e5e7eb", color: "#6b7280", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "600" },
  stepActive: { background: "#c9a44d", color: "#fff" },
  stepDone: { background: "#16a34a", color: "#fff" },
  stepLabel: { fontSize: "14px", color: "#6b7280" },
  errorBox: { background: "#fee2e2", color: "#dc2626", padding: "12px 16px", borderRadius: "6px", marginBottom: "16px", fontSize: "14px" },
  card: { background: "#fff", borderRadius: "12px", padding: "28px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", marginBottom: "20px" },
  cardTitle: { fontSize: "18px", fontWeight: "600", color: "#111827", marginBottom: "20px" },
  sectionTitle: { fontSize: "15px", fontWeight: "600", color: "#374151", margin: "24px 0 10px", borderBottom: "1px solid #f3f4f6", paddingBottom: "6px" },
  label: { display: "block", fontSize: "13px", fontWeight: "500", color: "#374151", marginBottom: "5px" },
  hint: { color: "#9ca3af", fontWeight: "400" },
  input: { width: "100%", padding: "9px 12px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", marginBottom: "14px", boxSizing: "border-box" },
  textarea: { width: "100%", padding: "9px 12px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", marginBottom: "14px", boxSizing: "border-box", resize: "vertical" },
  checkLabel: { display: "flex", alignItems: "center", fontSize: "14px", color: "#374151", cursor: "pointer", marginBottom: "14px" },
  listRow: { display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px" },
  removeBtn: { background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "4px", padding: "6px 10px", cursor: "pointer", fontSize: "12px", whiteSpace: "nowrap" },
  addBtn: { background: "none", border: "1px dashed #d1d5db", color: "#6b7280", borderRadius: "6px", padding: "7px 14px", cursor: "pointer", fontSize: "13px", marginBottom: "8px" },
  toggleBtn: { padding: "8px 16px", border: "1px solid #d1d5db", borderRadius: "6px", cursor: "pointer", fontSize: "13px", background: "#fff", color: "#374151" },
  toggleActive: { background: "#c9a44d", color: "#fff", border: "1px solid #c9a44d" },
  primaryBtn: { padding: "10px 22px", background: "#c9a44d", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "14px", marginTop: "8px" },
  secondaryBtn: { padding: "10px 22px", background: "#1f2937", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "14px" },
  skipBtn: { padding: "10px 22px", background: "#fff", color: "#6b7280", border: "1px solid #d1d5db", borderRadius: "6px", cursor: "pointer", fontSize: "14px" },
  infoNote: { background: "#f0fdf4", color: "#166534", padding: "10px 14px", borderRadius: "6px", fontSize: "13px", marginBottom: "20px" },
  successBox: { background: "#fff", borderRadius: "12px", padding: "40px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", maxWidth: "560px", margin: "60px auto" },
  credBox: { background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "14px 18px", marginBottom: "8px" },
  credRow: { display: "flex", justifyContent: "space-between", alignItems: "center", margin: "4px 0", fontSize: "14px" },
  credLabel: { color: "#6b7280", fontSize: "13px" },
};
