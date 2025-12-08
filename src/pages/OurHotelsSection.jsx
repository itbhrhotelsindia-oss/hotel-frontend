import React, { useState, useEffect } from "react";
import HeaderBar from "../components/HeaderBar.jsx";
import "./OurHotelsSection.css";
import Footer from "../components/Footer.jsx";
import { useLocation } from "react-router-dom";

export default function OurHotelsSection() {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
      <h1 className="section-heading">
        <span className="line" style={{ display: "inline-block", width: "100px", height: "3px", backgroundColor: "#cfa349", marginRight: "10px", marginBottom: "10px" }} />
        OUR DESTINATIONS
        <span className="line" style={{ display: "inline-block", width: "100px", height: "3px", backgroundColor: "#cfa349", marginLeft: "10px", marginBottom: "10px" }} />
      </h1>
      
      <div className="our-hotels-descriptions">
  <p>
    From spiritual vows in temple towns to beachside pheras, royal baraats in heritage palaces
    to hilltop mandaps — Pride Hotels, India’s fastest-growing hospitality chain, offers the
    country’s most diverse wedding destinations, catering to host 20 to 2,000 guests. Each year,
    over 200 couples choose to curate their Weddings with Pride. Because when the moment is once
    in a lifetime, your love deserves a celebration steeped in culture, care, and Indian warmth.
  </p>
</div>
      <div className="our-hotels-container">
        <img src={"/assets/g1.png"} className="offer-image" />
      </div>
      
    <section className="event-section">
      <div className="event-grid">

        {/* MICE */}
        <div className="event-column">
          <h2 className="event-title">
            MICE <span className="event-icon">🏨</span>
          </h2>
          <ul className="event-list">
            <li>New Delhi</li>
            <li>Kolkata</li>
            <li>Ahmedabad</li>
            <li>Jaipur</li>
            <li>Udaipur</li>
            <li>Rajkot</li>
            <li>Bharuch</li>
            <li>Nagpur</li>
            <li>Indore</li>
            <li>Bhopal</li>
            <li>Phaltan</li>
            <li>Dehradun</li>
            <li>Surat</li>
            <li>Jodhpur</li>
          </ul>
        </div>

        {/* WEDDING */}
        <div className="event-column">
          <h2 className="event-title">
            WEDDING <span className="event-icon">💍</span>
          </h2>
          <ul className="event-list">
            <li>New Delhi</li>
            <li>Jaipur</li>
            <li>Udaipur</li>
            <li>Phaltan</li>
            <li>Kolkata</li>
            <li>Goa</li>
            <li>Jodhpur</li>
            <li>Dehradun</li>
          </ul>
        </div>

        {/* PILGRIM */}
        <div className="event-column">
          <h2 className="event-title">
            PILGRIM <span className="event-icon">🛕</span>
          </h2>
          <ul className="event-list">
            <li>Becharaji</li>
            <li>Puri</li>
            <li>Haridwar</li>
          </ul>
        </div>

      </div>
    </section>

    <section className="leisure-section">

      {/* TITLE */}
      <h2 className="leisure-title">
        LEISURE <span className="leisure-icon">🌂</span>
      </h2>

      {/* GRID */}
      <div className="leisure-grid">

        {/* CULTURAL */}
        <div className="leisure-column">
          <h3 className="leisure-heading">Cultural</h3>
          <ul className="leisure-list">
            <li><a href="#">Ahmedabad</a></li>
            <li><a href="#">Haridwar</a></li>
            <li><a href="#">Dwarka</a></li>
            <li><a href="#">Jaipur</a></li>
            <li><a href="#">Rishikesh</a></li>
            <li><a href="#">Puri</a></li>
            <li><a href="#">Chennai</a></li>
            <li><a href="#">Jodhpur</a></li>
          </ul>
        </div>

        {/* BEACH */}
        <div className="leisure-column">
          <h3 className="leisure-heading">Beach</h3>
          <ul className="leisure-list">
            <li><a href="#">Goa</a></li>
            <li><a href="#">Puri</a></li>
            <li><a href="#">Daman</a></li>
          </ul>
        </div>

        {/* HILL SIDE */}
        <div className="leisure-column">
          <h3 className="leisure-heading">Hill Side</h3>
          <ul className="leisure-list">
            <li><a href="#">Mussoorie</a></li>
            <li><a href="#">Jaipur</a></li>
            <li><a href="#">Jodhpur</a></li>
            <li><a href="#">Dehradun</a></li>
          </ul>
        </div>

        {/* ROYAL */}
        <div className="leisure-column">
          <h3 className="leisure-heading">Royal</h3>
          <ul className="leisure-list">
            <li><a href="#">Phaltan</a></li>
            <li><a href="#">Jaipur</a></li>
            <li><a href="#">Udaipur</a></li>
            <li><a href="#">Jodhpur</a></li>
          </ul>
        </div>

      </div>

      {/* BOOK BUTTON */}
      <div className="leisure-btn-wrapper">
        <button className="leisure-btn">BOOK NOW</button>
      </div>

    </section>


            <Footer contactInfo={contactInfo} />
    </main>
  );
}