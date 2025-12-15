import React, { useState, useEffect } from "react";
import HeaderBar from "../components/HeaderBar.jsx";
import "./WeddingSection.css";
import Footer from "../components/Footer.jsx";
import EnquiryForm from "./EnquiryForm.jsx";
import { FaRing, FaHeart, FaLandmark } from "react-icons/fa";
import { useLocation } from "react-router-dom";

export default function WeddingsSection() {
  const location = useLocation();
  const contactInfo = location.state?.contactInfo || {};
  const BASE_URL = "http://localhost:8080";
  const [ourWeddingsData, setWeddingssData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(true);

  useEffect(() => {
    async function loadHWeddings() {
      try {
        const res = await fetch(`${BASE_URL}/api/weddings/`);
        const data = await res.json();
        setWeddingssData(data[0]); // API returns list
      } catch (err) {
        console.error("API error:", err);
      }
      setLoading(false);
    }
    loadHWeddings();
  }, []);

  const items = [
    {
      title: "Cocktail Soirée",
      text: `Set the tone for your wedding with an elegant cocktail night at Pride Hotels & Resorts. 
      An evening of sophistication and celebration, where guests can mingle, toast, 
      and revel in the excitement leading up to your big day. With crafted cocktails, 
      gourmet delights, and a lively ambiance, this stylish gathering creates the perfect 
      prelude to the grand festivities ahead.`,
      image: "/assets/g1.png",
      layout: "text-left",
    },
    {
      title: "Bridal Shower",
      text: `Cherish special moments with your closest friends and family at Pride Hotels & Resorts, 
      where we create the perfect setting for an unforgettable bridal shower. 
      From elegant décor to curated menus and personalised touches, 
      our thoughtfully designed venues ensure a joyous and intimate celebration 
      as you embark on your journey to "I do".`,
      image: "/assets/g2.png",
      layout: "image-left",
    },
  ];

  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading || !ourWeddingsData) {
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
        <div style={{ height: "180px" }} />
        <h2 style={{ textAlign: "center" }}>Loading Destinations...</h2>
      </main>
    );
  }

  const {
    id,
    title,
    description,
    videoUrl,
    bannerLines,
    stats,
    festivities,
    highlights,
  } = ourWeddingsData;

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

      <section className="video-section">
        <video
          width="100%"
          height="auto"
          autoPlay
          muted
          loop
          playsInline
          controls
        >
          <source src={BASE_URL + videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </section>
      <section className="stats-banner">
        <div className="stats-banner-inner">
          <div className="stat-item">
            <h2>{stats[0].value}</h2>
            <p>{stats[0].label}</p>
          </div>

          <div className="stat-item">
            <h2>{stats[1].value}</h2>
            <p>{stats[1].label}</p>
          </div>

          <div className="stat-item">
            <h2>{stats[2].value}</h2>
            <p>{stats[2].label}</p>
          </div>
        </div>
      </section>
      {/* ===== DESCRIPTION PARAGRAPH ===== */}
      <section className="wedding-description">
        <p>{description}</p>
      </section>

      <EnquiryForm />

      <section className="wedding-section">
        <h2 className="wedding-title">{festivities.title}</h2>

        <p className="wedding-subtitle">{festivities.description}</p>

        <div className="wedding-list">
          {festivities.festivitiesList.map((item, i) => (
            <div
              key={i}
              className={`wedding-row ${
                item.layout === "image-left" ? "reverse" : ""
              }`}
            >
              {/* TEXT */}
              <div className="wedding-text">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>

              {/* IMAGE */}
              <div className="wedding-image">
                <img src={BASE_URL + item.imageUrl} alt={item.title} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="wedding-strip-container">
        <div className="wedding-strip-box">
          <FaRing className="wedding-icon" />
          {/* <span>🏩 India’s Large Weddings</span> */}
          <span>India’s Large Weddings</span>
        </div>

        <div className="wedding-strip-box">
          <FaHeart className="wedding-icon" />
          {/* <span>🥂 Intimate Gatherings</span> */}
          <span>Intimate Gatherings</span>
        </div>

        <div className="wedding-strip-box">
          <FaLandmark className="wedding-icon" />
          {/* <span>⛩️ Lavish Lawns</span> */}
          <span>Lavish Lawns</span>
        </div>
      </div>

      <Footer contactInfo={contactInfo} />
    </main>
  );
}
