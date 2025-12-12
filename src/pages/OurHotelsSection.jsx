import React, { useState, useEffect } from "react";
import HeaderBar from "../components/HeaderBar.jsx";
import "./OurHotelsSection.css";
import Footer from "../components/Footer.jsx";
import { useLocation } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaLinkedinIn,
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
} from "react-icons/fa";

export default function OurHotelsSection() {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const location = useLocation();
  const contactInfo = location.state?.contactInfo || {};

  const [ourHotelsData, setOurHotelsData] = useState(null);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "http://localhost:8080";

  useEffect(() => {
    async function loadHotels() {
      try {
        const res = await fetch(`${BASE_URL}/api/our-hotels/`);
        const data = await res.json();
        setOurHotelsData(data[0]); // API returns list
      } catch (err) {
        console.error("API error:", err);
      }
      setLoading(false);
    }
    loadHotels();
  }, []);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔥 Prevent crash while API is loading
  if (loading || !ourHotelsData) {
    return (
      <main className="offers-page">
        <HeaderBar
          scrolled={true}
          dropdownOpen={dropdownOpen}
          setDropdownOpen={setDropdownOpen}
          bgColor="#e8e8e8"
          contactInfo={contactInfo}
        />
        <div style={{ height: "180px" }} />
        <h2 style={{ textAlign: "center" }}>Loading Destinations...</h2>
      </main>
    );
  }

  // 🟢 Safe to destructure now!
  const {
    title,
    text,
    image,
    mice,
    wedding,
    pilgrim,
    longWeekends,
    corporate,
    leisure,
  } = ourHotelsData;

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
        {title}
        <span
          className="line"
          style={{
            display: "inline-block",
            width: "100px",
            height: "3px",
            backgroundColor: "#cfa349",
            marginLeft: "10px",
            marginBottom: "10px",
          }}
        />
      </h1>

      <div className="our-hotels-descriptions">
        <p>{text}</p>
      </div>
      <div className="our-hotels-container">
        <img src={BASE_URL + image} className="offer-image" />
      </div>

      <section className="event-section">
        <div className="event-grid">
          {/* MICE */}
          <div className="event-column">
            <h2 className="event-title">
              {mice.title} <span className="event-icon">🏨</span>
            </h2>

            <ul className="event-list">
              {mice.locations.map((loc, i) => (
                <li key={i}>{loc}</li>
              ))}
            </ul>
          </div>

          {/* Wedding */}
          <div className="event-column">
            <h2 className="event-title">
              {wedding.title} <span className="event-icon">💍</span>
            </h2>
            <ul className="event-list">
              {wedding.locations.map((loc, i) => (
                <li key={i}>{loc}</li>
              ))}
            </ul>
          </div>

          {/* Pilgrim */}
          <div className="event-column">
            <h2 className="event-title">
              {pilgrim.title} <span className="event-icon">🛕</span>
            </h2>
            <ul className="event-list">
              {pilgrim.locations.map((loc, i) => (
                <li key={i}>{loc}</li>
              ))}
            </ul>
          </div>

          {/* Long Weekends */}
          <div className="event-column">
            <h2 className="event-title">
              {longWeekends.title} <span className="event-icon"></span>
              {/* <img
                src={BASE_URL + longWeekends.iconUrl}
                className="event-icon-img"
              /> */}
            </h2>
            <ul className="event-list">
              {longWeekends.locations.map((loc, i) => (
                <li key={i}>{loc}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="leisure-section">
        <h2 className="leisure-title">LEISURE 🌴</h2>

        <div className="leisure-grid">
          {/* Cultural */}
          <div className="leisure-column">
            <h3 className="leisure-heading">
              {leisure.cultural.title}
              <img
                src={BASE_URL + leisure.cultural.iconUrl}
                className="event-icon-img"
              />
            </h3>
            <ul className="leisure-list">
              {leisure.cultural.locations.map((loc, i) => (
                <li key={i}>{loc}</li>
              ))}
            </ul>
          </div>

          {/* Beach */}
          <div className="leisure-column">
            <h3 className="leisure-heading">
              {leisure.beach.title}
              <img
                src={BASE_URL + leisure.beach.iconUrl}
                className="event-icon-img"
              />
            </h3>
            <ul className="leisure-list">
              {leisure.beach.locations.map((loc, i) => (
                <li key={i}>{loc}</li>
              ))}
            </ul>
          </div>

          {/* Hillside */}
          <div className="leisure-column">
            <h3 className="leisure-heading">
              {leisure.hillside.title}
              <img
                src={BASE_URL + leisure.hillside.iconUrl}
                className="event-icon-img"
              />
            </h3>
            <ul className="leisure-list">
              {leisure.hillside.locations.map((loc, i) => (
                <li key={i}>{loc}</li>
              ))}
            </ul>
          </div>

          {/* Royal */}
          <div className="leisure-column">
            <h3 className="leisure-heading">
              {leisure.royal.title}
              <img
                src={BASE_URL + leisure.royal.iconUrl}
                className="event-icon-img"
              />
            </h3>
            <ul className="leisure-list">
              {leisure.royal.locations.map((loc, i) => (
                <li key={i}>{loc}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="leisure-btn-wrapper">
          <button className="leisure-btn">BOOK NOW</button>
        </div>
      </section>

      <Footer contactInfo={contactInfo} />
    </main>
  );
}
