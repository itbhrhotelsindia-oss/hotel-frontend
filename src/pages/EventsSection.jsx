import React, { useState, useEffect } from "react";
import HeaderBar from "../components/HeaderBar.jsx";
import "./EventsSection.css";
import Footer from "../components/Footer.jsx";
import { useLocation } from "react-router-dom";
import BanquetSlider from "../components/BanquetSlider.jsx";

export default function EventsSection() {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

  const offers = [
    {
      id: 1,
      title: "PERFECT STAYCATIONS – THIS JOYFUL SEASON",
      desc: "This holiday season, enjoy the perfect staycation with exclusive savings crafted just for you.",
      validity: "04 Dec 2025 – 11 Jan 2026",
      img: "/assets/g1.png",
      loginBtn: "LOGIN / JOIN"
    },
    {
      id: 2,
      title: "SUITE SURPRISES - MEMBER ONLY",
      desc: "Indulge in a stay that goes beyond the ordinary and experience enhanced comfort, added space, thoughtful touches and unparalleled extravagance.",
      validity: "Round the Year",
      img: "/assets/g2.png",
      loginBtn: "LOGIN / JOIN"
    },
    {
      id: 1,
      title: "PERFECT STAYCATIONS – THIS JOYFUL SEASON",
      desc: "This holiday season, enjoy the perfect staycation with exclusive savings crafted just for you.",
      validity: "04 Dec 2025 – 11 Jan 2026",
      img: "/assets/g1.png",
      loginBtn: "LOGIN / JOIN"
    },
    {
      id: 2,
      title: "SUITE SURPRISES - MEMBER ONLY",
      desc: "Indulge in a stay that goes beyond the ordinary and experience enhanced comfort, added space, thoughtful touches and unparalleled extravagance.",
      validity: "Round the Year",
      img: "/assets/g2.png",
      loginBtn: "LOGIN / JOIN"
    }
  ];

  return (
    <main className="offers-page">
      <HeaderBar
        scrolled={true}
        dropdownOpen={dropdownOpen}
        setDropdownOpen={setDropdownOpen}
        bgColor="#e8e8e8"
        contactInfo={contactInfo}
      />

      {/* Spacer so content does not hide behind sticky header */}
      <div style={{ height: "140px" }}></div>
      
      <h1 className="section-heading"> <span className="line" style={{ display: "inline-block", width: "100px", height: "3px", backgroundColor: "#cfa349", marginRight: "10px", marginBottom: "10px" }} />
        PLAN YOUR EVENTS WITH US
       <span className="line" style={{ display: "inline-block", width: "100px", height: "3px", backgroundColor: "#cfa349", marginRight: "10px", marginBottom: "10px" }} />
       </h1>

      <div className="offers-section">
        <BanquetSlider />
      </div>
         
    {eventsSection()}
      
            <Footer contactInfo={contactInfo} />
    </main>
  );

  function eventsSection() {
    return <div className="events-page-container">

      {/* -------- IMAGE SELECTION ROW -------- */}
      <div className="events-row">

        {/* FAMILY EVENTS */}
        <div
          className={`event-card ${selected === "family" ? "active" : ""}`}
          onClick={() => setSelected("family")}
        >
          <img
            src="/assets/brand-1.png"
            alt="Family Events"
            className="event-img" />
          <h3 className="event-title">FAMILY EVENTS</h3>
        </div>

        {/* BUSINESS MEETINGS */}
        <div
          className={`event-card ${selected === "business" ? "active" : ""}`}
          onClick={() => setSelected("business")}
        >
          <img
            src="/assets/brand-2.png"
            alt="Business Meetings"
            className="event-img" />
          <h3 className="event-title">BUSINESS MEETINGS</h3>
        </div>
      </div>

      {/* -------- SELECTED LABEL -------- */}
      <h2 className="selected-heading">
        {selected === "family" ? "Family Event Enquiry" : "Business Meeting Enquiry"}
      </h2>

      {/* -------- FORM SECTION -------- */}
      <form className="event-form">
        <label>Name</label>
        <input type="text" placeholder="Enter your name" />

        <label>Email id</label>
        <input type="email" placeholder="Enter your email" />

        <label>Phone Number</label>
        <div className="phone-row">
          <select>
            <option>🇮🇳 +91</option>
            <option>🇺🇸 +1</option>
            <option>🇬🇧 +44</option>
          </select>
          <input type="text" placeholder="081234 56789" />
        </div>

        <label>Query</label>
        <textarea rows="4" placeholder="Enter your query here…" />

        <button className="submit-btn">Submit</button>
      </form>
    </div>;
  }
}