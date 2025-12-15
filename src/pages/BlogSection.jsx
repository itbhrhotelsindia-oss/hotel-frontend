import React, { useState, useEffect } from "react";
import HeaderBar from "../components/HeaderBar.jsx";
import Footer from "../components/Footer.jsx";
import { useLocation } from "react-router-dom";
import "./DiningSection.css";

export default function BlogSection() {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const [showBooking, setShowBooking] = useState(true);
  const contactInfo = location.state?.contactInfo || {};

  const restaurants = [
    {
      id: "1",
      title: "Café 1",
      image: "/assets/g1.png",
      logo: "/assets/g4.png",
    },
    {
      id: "2",
      title: "Café 2",
      image: "/assets/g1.png",
      logo: "/assets/g4.png",
    },
    {
      id: "3",
      title: "BHR restaurent",
      image: "/assets/g1.png",
      logo: "/assets/g4.png",
    },
  ];
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

      <section className="dining-banner">
        <img
          src="/assets/g1.png"
          alt="Dining Banner"
          className="banner-image"
        />
      </section>

      <h1 className="dining-heading">Dine With Us</h1>
      <p className="dining-description">
        Our varied dining options coupled with well-appointed rooms, elegantly
        designed banquet spaces, numerous recreational facilities and seamless
        service tailored to suit your every whim, add a special touch to all
        your occasions.
      </p>

      <p className="dining-subtext">
        With so much to offer, we take pride in delivering exceptional dining
        experiences!
        <br />
        From speciality restaurants and coffee shops to bakeries and more, we
        have all you need for an ideal culinary journey.
      </p>

      <section className="dining-grid">
        {restaurants.map((item, i) => (
          <div key={i} className="dining-card">
            <img src={item.image} alt={item.title} className="dining-img" />

            <div className="dining-logo-box">
              <img src={item.logo} alt={item.title} className="dining-logo" />
            </div>

            <h3>{item.title}</h3>

            <button
              className="dining-btn"
              onClick={() => navigate(`/dining/${item.id}`)}
            >
              MORE INFO
            </button>
          </div>
        ))}
      </section>

      <section className="offers-section"></section>

      <Footer contactInfo={contactInfo} />
    </main>
  );
}
