import React, { useState, useEffect } from "react";
import HeaderBar from "../components/HeaderBar.jsx";
import "./PartnerSection.css";
import Footer from "../components/Footer.jsx";
import { useLocation } from "react-router-dom";

export default function PartnersSection() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const contactInfo = location.state?.contactInfo || {};
  const [showBooking, setShowBooking] = useState(true);

  const [cities, setCities] = useState([]);
  const [citiesLoading, setCitiesLoading] = useState(true);
  const [formData, setFormData] = useState({
    companyName: "",
    website: "",
    fullName: "",
    email: "",
    contactNumber: "",
    partnershipType: "",
    location: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setResponseMsg("");

    try {
      const res = await fetch(`${BASE_URL}/api/partner-with-us`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Submission failed");
      }

      setResponseMsg("Thank you! Our team will contact you shortly.");

      // Reset form after success
      setFormData({
        companyName: "",
        website: "",
        fullName: "",
        email: "",
        contactNumber: "",
        partnershipType: "",
        location: "",
        message: "",
      });
    } catch (err) {
      console.error(err);
      setResponseMsg("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function loadCities() {
      try {
        const res = await fetch(`${BASE_URL}/api/cities/`);
        if (!res.ok) throw new Error("Failed to fetch cities");

        const data = await res.json();
        setCities(data);
      } catch (err) {
        console.error("Cities API error:", err);
      } finally {
        setCitiesLoading(false);
      }
    }

    loadCities();
  }, []);

  return (
    <main className="offers-page">
      <HeaderBar
        scrolled={true}
        dropdownOpen={dropdownOpen}
        setDropdownOpen={setDropdownOpen}
        bgColor="#e8e8e8"
        contactInfo={contactInfo}
        setShowBooking={setShowBooking}
      />

      {/* Spacer so content does not hide behind sticky header */}
      <div style={{ height: "140px" }}></div>

      <h1 className="section-heading">
        <span
          className="line"
          style={{
            display: "inline-block",
            width: "100px",
            height: "3px",
            backgroundColor: "#cfa349",
            marginRight: "10px",
            marginBottom: "10px",
          }}
        />
        Partner With US
        <span
          className="line"
          style={{
            display: "inline-block",
            width: "100px",
            height: "3px",
            backgroundColor: "#cfa349",
            marginRight: "10px",
            marginBottom: "10px",
          }}
        />
      </h1>

      <p className="section-para">
        Join hands with one of India’s fastest-growing hospitality groups. Let’s
        create exceptional experiences together.
      </p>

      <div className="partner-container">
        {/* FORM SECTION */}
        <form onSubmit={handleSubmit} className="partner-form">
          {/* Company Details */}
          <h2 className="section-title">Company Information</h2>

          <div className="form-row">
            <div className="form-group">
              <label>Company Name *</label>
              <input
                type="text"
                name="companyName"
                placeholder="Company Name"
                value={formData.companyName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Website</label>
              <input
                type="url"
                name="website"
                placeholder="Website"
                value={formData.website}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Contact Person */}
          <h2 className="section-title">Primary Contact</h2>

          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email ID *</label>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Contact Number *</label>
              <input
                type="tel"
                name="contactNumber"
                placeholder="Contact Number"
                value={formData.contactNumber}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Partnership Type */}
          <h2 className="section-title">Partnership Type</h2>

          <div className="form-row">
            <div className="form-group full-width">
              <label>Select Partnership Category *</label>
              <select
                name="partnershipType"
                value={formData.partnershipType}
                onChange={handleChange}
                required
              >
                <option value="">Select Partnership Type</option>
                <option>Hotel Franchise</option>
                <option>Management Contract</option>
                <option>Investment Partnership</option>
                <option>Corporate Collaboration</option>
                <option>Vendor / Supplier Partnership</option>
                <option>Register Your Hotel</option>
              </select>
            </div>
          </div>

          <h2 className="section-title">Location</h2>

          <div className="form-row">
            <div className="form-group full-width">
              <label>Select Hotel Location *</label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              >
                <option value="">
                  {citiesLoading ? "Loading locations..." : "Select Location"}
                </option>

                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Additional Details */}
          <h2 className="section-title">Additional Details</h2>

          <div className="form-row">
            <div className="form-group full-width">
              <label>Message / Proposal *</label>
              <textarea
                name="message"
                placeholder="Message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Submit */}

          <button
            type="submit"
            disabled={submitting}
            className="partner-submit-btn"
          >
            {submitting ? "Submitting..." : "Submit Application"}
          </button>

          {responseMsg && <p className="form-message">{responseMsg}</p>}
        </form>
      </div>

      <Footer contactInfo={contactInfo} />
    </main>
  );
}
