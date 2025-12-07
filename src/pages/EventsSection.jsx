import React, { useState, useEffect } from "react";
import HeaderBar from "../components/HeaderBar.jsx";
import "./OffersSection.css";
import Footer from "../components/Footer.jsx";

export default function EventsSection() {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
      />

      {/* Spacer so content does not hide behind sticky header */}
      <div style={{ height: "140px" }}></div>
      
        <h1 className="offers-heading">--------     EXCLUSIVE OFFERS     ---------</h1>

      <section className="offers-section">
        
      </section>
      
            <Footer />
    </main>
  );
}