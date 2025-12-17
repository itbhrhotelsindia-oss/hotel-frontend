import React, { useState, useEffect } from "react";
import HeaderBar from "../components/HeaderBar.jsx";
import "./OurHotelsSection.css";
import Footer from "../components/Footer.jsx";
import { useLocation } from "react-router-dom";
import { FaFacebookF } from "react-icons/fa";
import { bookingDialog } from "../components/bookingDialog.jsx";

export default function OurHotelsSection() {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [showBooking, setShowBooking] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [cities, setCities] = useState([]);
  const [selectedHotels, setSelectedHotels] = useState([]);

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
    async function loadCities() {
      try {
        const res = await fetch(`${BASE_URL}/api/cities/`);
        const data = await res.json();
        setCities(data);
      } catch (err) {
        console.error("Cities API error:", err);
      }
    }
    loadCities();
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
  const destinations = [
    {
      city: "Delhi",
      subtitle: "Exciting! From 9999",
      image: "/assets/india-gate.jpeg",
    },
    {
      city: "Agra",
      subtitle: "Taj Mahal Awaits",
      image: "/assets/taj.jpg",
    },
    {
      city: "Jim Corrbet",
      subtitle: "Future City",
      image: "/assets/jim-cor.jpg",
    },
    {
      city: "Mussorie",
      subtitle: "Future City",
      image: "/assets/mussorie.jpg",
    },
    {
      city: "Rishikesh",
      subtitle: "Future City",
      image: "/assets/rishikesh.jpg",
    },
    {
      city: "Ayodhya",
      subtitle: "Future City",
      image: "/assets/g4.png",
    },
    {
      city: "Lucknow",
      subtitle: "Future City",
      image: "/assets/g3.png",
    },
  ];
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

      <div className="destinations-wrapper">
        <div className="our-hotels-descriptions">
          <p>{text}</p>
        </div>
        <div className="destinations-grid">
          {destinations.map((item, index) => (
            <div key={index} className="destination-card">
              {/* Badge Icon */}
              {/* <span className="badge-icon">🏨</span> */}

              {/* Image */}
              <img
                className="destination-image"
                src={item.image}
                alt={item.city}
              />

              {/* Text Container */}
              <div className="destination-text">
                <h3>{item.city}</h3>
                <p>{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* <div className="our-hotels-container">
        <img src={BASE_URL + image} className="offer-image" />
      </div> */}

      <section className="destination-list-section">
        {/* Row 1 - MICE */}
        <div className="destination-row">
          <img src="/assets/jim-cor.jpg" alt="MICE" className="dl-image" />

          <div className="dl-text">
            <h2 className="dl-title">MICE 🏨</h2>
            <ul className="dl-list">
              {mice.locations.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="destination-row reverse">
          <img src="/assets/rishikesh.jpg" alt="Wedding" className="dl-image" />

          <div className="dl-text">
            <h2 className="dl-title">Wedding 💍</h2>
            <ul className="dl-list">
              {wedding.locations.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="destination-row">
          <img src="/assets/jim-cor.jpg" alt="MICE" className="dl-image" />

          <div className="dl-text">
            <h2 className="dl-title">PILIGRAM 🏨</h2>
            <ul className="dl-list">
              {mice.locations.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="destination-row reverse">
          <img src="/assets/rishikesh.jpg" alt="Wedding" className="dl-image" />

          <div className="dl-text">
            <h2 className="dl-title">WEEKEND 💍</h2>
            <ul className="dl-list">
              {wedding.locations.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {bookingOpen &&
        bookingDialog(
          setBookingOpen,
          setShowBooking,
          cities,
          setSelectedHotels,
          selectedHotels
        )}

      <Footer contactInfo={contactInfo} />
    </main>
  );
}
