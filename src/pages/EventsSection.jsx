import React, { useState, useEffect } from "react";
import HeaderBar from "../components/HeaderBar.jsx";
import "./EventsSection.css";
import Footer from "../components/Footer.jsx";
import { useLocation } from "react-router-dom";
import ModernSlider from "../components/ModernSlider.jsx";

export default function EventsSection() {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showBooking, setShowBooking] = useState(true);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [selected, setSelected] = useState("family");
  const [eventsPage, setEventsPage] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const contactInfo = location.state?.contactInfo || {};

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    location: "",
    query: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch(`${BASE_URL}/api/events-page`);
        if (!res.ok) throw new Error("Failed to fetch events-page data");

        const data = await res.json();
        setEventsPage(data);

        // default selected category
        const firstKey = data?.eventsSection?.eventCategories?.[0]?.key;
        if (firstKey) setSelected(firstKey);
      } catch (err) {
        console.error("Events API Error", err);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);
  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 40);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  if (loading || !eventsPage) {
    return (
      <div style={{ padding: "200px", textAlign: "center" }}>
        Loading events...
      </div>
    );
  }
  const { pageTitle, eventSlider, eventsSection } = eventsPage;

  const categories = eventsSection?.eventCategories || [];
  const slides = eventSlider?.images || [];

  const selectedEvent = categories.find((c) => c.key === selected);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const payload = {
        pageId: "EVENTS-PAGE-001",
        category: selected, // family / business
        ...formData,
      };

      const res = await fetch(`${BASE_URL}/api/events/enquiry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed");

      setMessage("Thank you! Our team will contact you shortly.");

      setFormData({
        name: "",
        email: "",
        phone: "",
        eventType: "",
        location: "",
        query: "",
      });
    } catch (err) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

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

      <h1 className="section-heading"> {pageTitle}</h1>

      <div className="offers-section">
        <ModernSlider images={slides} autoPlay={true} interval={4000} />;
      </div>

      <h2 className="eventsection-heading "> {eventsSection.description}</h2>
      {eventsSectionList()}

      <Footer contactInfo={contactInfo} />
    </main>
  );

  function eventsSectionList() {
    return (
      <div className="events-page-container">
        {/* -------- IMAGE SELECTION ROW -------- */}
        <div className="events-row">
          {categories.map((event) => (
            <div
              key={event.key}
              className={`event-card ${selected === event.key ? "active" : ""}`}
              onClick={() => setSelected(event.key)}
            >
              <img src={event.image} alt={event.title} className="event-img" />
              <h3 className="event-heading">{event.title}</h3>
            </div>
          ))}
        </div>

        <h2 className="selected-heading">
          {categories.find((c) => c.key === selected)?.heading}
        </h2>

        <p className="selected-description">
          {/* {categories.find((c) => c.key === selected)?.description} */}
        </p>

        {formSection()}
      </div>
    );

    function formSection() {
      return (
        <form className="event-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email id </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone Number *</label>
              <div className="phone-row">
                <select>
                  <option>🇮🇳 +91</option>
                </select>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <select
            name="eventType"
            value={formData.eventType}
            onChange={handleChange}
            required
          >
            <option value="">Select Event</option>
            <option>Wedding</option>
            <option>Birthday Party</option>
            <option>Corporate Event</option>
          </select>

          <div className="form-row">
            <div className="form-group full-width">
              <label>Location *</label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              >
                <option value="">Select Location</option>
                <option>Noida</option>
                <option>Delhi</option>
                <option>Goa</option>
                <option>Haridwar</option>
                <option>Rishikesh</option>
                <option>Jim Corbett</option>
              </select>
            </div>
          </div>

          <label>Query</label>
          <textarea
            rows="4"
            name="query"
            value={formData.query}
            onChange={handleChange}
            placeholder="Enter your query here…"
          />

          <button className="submit-btn" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit"}
          </button>

          {message && <p className="form-message">{message}</p>}
        </form>
      );
    }
  }
}
