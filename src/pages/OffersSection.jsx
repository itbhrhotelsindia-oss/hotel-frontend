import React, { useState, useEffect } from "react";
import HeaderBar from "../components/HeaderBar.jsx";
import "./OffersSection.css";
import Footer from "../components/Footer.jsx";
import { useLocation } from "react-router-dom";

export default function OffersSection() {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const contactInfo = location.state?.contactInfo || {};
  const [showBooking, setShowBooking] = useState(true);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function loadOffers() {
      try {
        const res = await fetch(`${BASE_URL}/api/offers`);
        if (!res.ok) throw new Error("Failed to fetch offers");

        const data = await res.json();
        setOffers(data);
      } catch (err) {
        console.error("Offers API Error → Using fallback", err);
      } finally {
        setLoading(false);
      }
    }

    loadOffers();
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
        EXCLUSIVE OFFERS
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

      <section className="offers-section">
        {loading ? (
          <p style={{ textAlign: "center", fontSize: "20px" }}>
            Loading offers...
          </p>
        ) : (
          <div className="offers-grid">
            {offers.map((offer) => (
              <div key={offer.id} className="offer-card">
                {/* IMAGE */}
                <img
                  src={`${offer.img}`}
                  alt={offer.title}
                  className="offer-img"
                />
                {/* CONTENT */}
                <div className="offer-content">
                  <h3 className="offer-title">{offer.title}</h3>

                  <p className="offer-desc">{offer.desc}</p>

                  <p className="offer-validity">
                    Validity: <strong>{offer.validity}</strong>
                  </p>

                  <div className="offer-actions">
                    <button className="offer-btn">{offer.loginBtn}</button>

                    {/* <button className="offer-more">
                      KNOW MORE <span>›</span>
                    </button> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer contactInfo={contactInfo} />
    </main>
  );
}
