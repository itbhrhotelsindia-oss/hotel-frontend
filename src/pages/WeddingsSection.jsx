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
    },];

  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

 
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
      
      <h1 className="offers-heading">--------     Make your Wedding Special With Us     ---------</h1>
      
      <section className="video-section">
        <video width="100%" height="auto" controls>
          <source src="/path-to-your-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </section>
      <section className="stats-banner">
  <div className="stats-banner-inner">
    
    <div className="stat-item">
      <h2>60</h2>
      <p>Hotels</p>
    </div>

    <div className="stat-item">
      <h2>5,500</h2>
      <p>Rooms</p>
    </div>

    <div className="stat-item">
      <h2>79+</h2>
      <p>Grand Venues</p>
    </div>

  </div>
</section>

      {/* ===== WEDDING / FEATURES STATS SECTION ===== */}


{/* ===== DESCRIPTION PARAGRAPH ===== */}
<section className="wedding-description">
  <p>
    From spiritual vows in temple towns to beachside pheras, royal baraats in heritage palaces
    to hilltop mandaps — Pride Hotels, India’s fastest-growing hospitality chain, offers the
    country’s most diverse wedding destinations, catering to host 20 to 2,000 guests. Each year,
    over 200 couples choose to curate their Weddings with Pride. Because when the moment is once
    in a lifetime, your love deserves a celebration steeped in culture, care, and Indian warmth.
  </p>
</section>

      <EnquiryForm />

      <section className="wedding-section">
      <h2 className="wedding-title">Wedding Festivities</h2>

      <p className="wedding-subtitle">
        Celebrate love in its most beautiful form, from intimate gatherings to grand receptions.
        Whether it's a vibrant Haldi, a dreamy Mehendi, or a glamorous cocktail soirée,
        let Pride Hotels & Resorts set the stage for your unforgettable journey.
      </p>

      <div className="wedding-list">
        {items.map((item, i) => (
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
              <img src={item.image} alt={item.title} />
            </div>
          </div>
        ))}
      </div>
    </section>

       <div className="wedding-strip-container">
      <div className="wedding-strip-box">
        <FaRing className="wedding-icon" />
        <span>India’s Large Weddings</span>
      </div>

      <div className="wedding-strip-box">
        <FaHeart className="wedding-icon" />
        <span>Intimate Gatherings</span>
      </div>

      <div className="wedding-strip-box">
        <FaLandmark className="wedding-icon" />
        <span>Lavish Lawns</span>
      </div>
    </div>
      
            <Footer contactInfo={contactInfo}/>
    </main>
  );
}