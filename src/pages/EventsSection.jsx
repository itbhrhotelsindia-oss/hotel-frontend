import React, { useState, useEffect } from "react";
import HeaderBar from "../components/HeaderBar.jsx";
import "./EventsSection.css";
import Footer from "../components/Footer.jsx";
import { useLocation } from "react-router-dom";
import BanquetSlider from "../components/BanquetSlider.jsx";
import ModernSlider from "../components/ModernSlider.jsx";

export default function EventsSection() {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showBooking, setShowBooking] = useState(true);
  const [selected, setSelected] = useState("family");
  const location = useLocation();
  const contactInfo = location.state?.contactInfo || {};
  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const slides = [
    "/assets/slider-1.jpg",
    "/assets/img1.jpg",
    "/assets/img2.jpg",
  ];

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
        {" "}
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
        PLAN YOUR EVENTS WITH US
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

      <div className="offers-section">
        <ModernSlider images={slides} autoPlay={true} interval={4000} />;
      </div>

      {eventsSection()}

      <Footer contactInfo={contactInfo} />
    </main>
  );

  function eventsSection() {
    return (
      <div className="events-page-container">
        {/* -------- IMAGE SELECTION ROW -------- */}
        <div className="events-row">
          <div
            className={`event-card ${selected === "family" ? "active" : ""}`}
            onClick={() => setSelected("family")}
          >
            <img
              src="/assets/img1.jpg"
              alt="Family Events"
              className="event-img"
            />
            <h3 className="event-title">FAMILY EVENTS</h3>
          </div>
          <div
            className={`event-card ${selected === "business" ? "active" : ""}`}
            onClick={() => setSelected("business")}
          >
            <img
              src="/assets/img2.jpg"
              alt="Business Meetings"
              className="event-img"
            />
            <h3 className="event-title">BUSINESS MEETINGS</h3>
          </div>
        </div>
        <h2 className="selected-heading">
          {selected === "family"
            ? "Family Event Enquiry"
            : "Business Meeting Enquiry"}
        </h2>

        {formSection()}
      </div>
    );

    function formSection() {
      return (
        <form className="event-form">
          <div className="form-row">
            <div className="form-group">
              <label>Name *</label>
              <input type="text" placeholder="Enter your name" required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email id </label>
              <input type="email" placeholder="Enter your email" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone Number *</label>
              <div className="phone-row">
                <select>
                  <option>🇮🇳 +91</option>
                </select>
                <input type="text" placeholder="" required />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label>Type of Event *</label>
              <select required>
                <option>Wedding</option>
                <option>Birthday Party</option>
                <option>Corporate Event</option>
                <option>Haridwar</option>
                <option>Rishikesh</option>
                <option>Jim Corrbet</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label>Location *</label>
              <select required>
                <option>Noida</option>
                <option>Delhi</option>
                <option>Goa</option>
                <option>Haridwar</option>
                <option>Rishikesh</option>
                <option>Jim Corrbet</option>
              </select>
            </div>
          </div>

          <label>Query</label>
          <textarea rows="4" placeholder="Enter your query here…" />

          <button className="submit-btn">Submit</button>
        </form>
      );
    }
  }
}
