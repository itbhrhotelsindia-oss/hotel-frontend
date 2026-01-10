import React, { useState, useEffect } from "react";
import HeaderBar from "../components/HeaderBar.jsx";
import "./OurHotelsSection.css";
import Footer from "../components/Footer.jsx";
import { useLocation } from "react-router-dom";
import { bookingDialog } from "../components/bookingDialog.jsx";
import { useNavigate } from "react-router-dom";
import CityHotelsModal from "../pages/CityHotelsModal";

export default function OurHotelsSection() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
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
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState("");
  const [cityHotels, setCityHotels] = useState([]);
  const [cityModalOpen, setCityModalOpen] = useState(false);
  const openCityDialog = (cityObj) => {
    setSelectedCity(cityObj.name);
    setCityHotels(cityObj.hotels);
    setCityModalOpen(true);
  };
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
      image: "/assets/img1.jpg",
    },
    {
      city: "Agra",
      subtitle: "Taj Mahal Awaits",
      image: "/assets/img2.jpg",
    },
    {
      city: "Jim Corrbet",
      subtitle: "Future City",
      image: "/assets/img3.jpg",
    },
    {
      city: "Mussorie",
      subtitle: "Future City",
      image: "/assets/slider-2.jpg",
    },
    {
      city: "Rishikesh",
      subtitle: "Future City",
      image: "/assets/slider-1.jpg",
    },
    {
      city: "Ayodhya",
      subtitle: "Future City",
      image: "/assets/slider-3.jpg",
    },
    {
      city: "Lucknow",
      subtitle: "Future City",
      image: "/assets/slider-1.jpg",
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
      <h1 className="section-heading">{title}</h1>
      <div className="destinations-wrapper">
        <div className="our-hotels-descriptions">
          <p>{text}</p>
        </div>
        <div className="destinations-grid">
          {cities.map((cityObj, index) => (
            <div
              key={index}
              className="destination-card"
              onClick={() => openCityDialog(cityObj)}
              style={{ cursor: "pointer" }}
            >
              <img
                className="destination-image"
                src={cityObj.cityImageUrl}
                alt={cityObj.name}
              />
              <div className="destination-text">
                <h3>{cityObj.name}</h3>
                {/* <p>
                  beajas kaslk dfuoasd fasoik lakjs kdjfn aks
                  dfiukhasndfkyasidfaskdfi. uishdf asuyd {cityObj.name}
                </p> */}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* <div className="our-hotels-container">
        <img src={BASE_URL + image} className="offer-image" />
      </div> */}

      {/* {eventsCategoriesSection()} */}

      {bookingOpen &&
        bookingDialog(
          setBookingOpen,
          setShowBooking,
          cities,
          setSelectedHotels,
          selectedHotels
        )}

      <CityHotelsModal
        open={cityModalOpen}
        onClose={() => setCityModalOpen(false)}
        city={selectedCity}
        hotels={cityHotels}
        contactInfo={contactInfo}
      />

      <Footer contactInfo={contactInfo} />
    </main>
  );

  function eventsCategoriesSection() {
    return (
      <section className="destination-list-section">
        {/* Row 1 - MICE */}
        <div className="destination-row">
          <img src="/assets/img1.jpg" alt="MICE" className="dl-image" />

          <div className="dl-text">
            <h2 className="dl-title">MICE 🏨</h2>
            <ul className="dl-list">
              {mice.locations.map((item, i) => (
                <li
                  key={i}
                  className="dl-list-item"
                  onClick={() => navigate(`/hotel-details/${item.i}`)}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="destination-row reverse">
          <img src="/assets/slider-2.jpg" alt="Wedding" className="dl-image" />

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
          <img src="/assets/img3.jpg" alt="MICE" className="dl-image" />

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
          <img src="/assets/img2.jpg" alt="Wedding" className="dl-image" />

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
    );
  }
}
