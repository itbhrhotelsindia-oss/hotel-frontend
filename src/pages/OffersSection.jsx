import React, { useState, useEffect } from "react";
import HeaderBar from "../components/HeaderBar.jsx";
import Footer from "../components/Footer.jsx";
import "./OffersSection.css";
import { useLocation } from "react-router-dom";

export default function OffersSection() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const contactInfo = location.state?.contactInfo || {};

  const BASE_URL = "http://localhost:8080";

  useEffect(() => {
    async function loadOffers() {
      try {
        const res = await fetch(`${BASE_URL}/api/offers`);

        if (!res.ok) throw new Error("Failed to fetch offers");

        let data = await res.json();

        // Clean image URLs (remove double slashes)
        data = data.map((offer) => ({
          ...offer,
          img: offer.img.replace("//", "/")
        }));

        setOffers(data);

      } catch (err) {
        console.error("Error fetching offers:", err);

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
        dropdownOpen={false}
        setDropdownOpen={() => {}}
        bgColor="#e8e8e8"
        contactInfo={contactInfo}
      />

      {/* Top spacer */}
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
            marginLeft: "10px",
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
                  src={`${BASE_URL}${offer.img}`}
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
                    <button className="offer-more">
                      KNOW MORE <span>›</span>
                    </button>
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
