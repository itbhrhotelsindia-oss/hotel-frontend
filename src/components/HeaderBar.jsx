import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaPhoneAlt, FaBars } from "react-icons/fa";
import CityHotelsModal from "../pages/CityHotelsModal";
import { bookingDialog } from "./bookingDialog";

export default function HeaderBar({
  scrolled,
  dropdownOpen,
  setDropdownOpen,
  bgColor = "#ffffff",
  contactInfo = {},
  setShowBooking,
}) {
  const [cityModalOpen, setCityModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [cityHotels, setCityHotels] = useState([]);
  const [selectedHotels, setSelectedHotels] = useState([]);

  const [cities, setCities] = useState([]); // <-- store cities from API

  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [bookingOpen, setBookingOpen] = useState(false);

  // ------------------------------------------------------------------
  // 1️⃣  FETCH CITIES FROM API
  // ------------------------------------------------------------------
  useEffect(() => {
    fetch("http://localhost:8080/api/cities/")
      .then((res) => res.json())
      .then((data) => {
        setCities(data);
      })
      .catch((err) => console.error("Error loading cities:", err));
  }, []);

  // ------------------------------------------------------------------
  // 2️⃣ OPEN CITY MODAL ON CITY CLICK
  // ------------------------------------------------------------------
  const openCityDialog = (cityObj) => {
    setSelectedCity(cityObj.name);
    setCityHotels(cityObj.hotels);
    setCityModalOpen(true);
  };

  // Close dropdown when user clicks outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const [menuOpen, setMenuOpen] = useState(false);

  // ------------------------------------------------------------------
  // COMPUTE GRID COLUMNS BASED ON NUMBER OF CITIES
  // ------------------------------------------------------------------
  const gridClass =
    cities.length > 30
      ? "cols-4"
      : cities.length > 20
      ? "cols-3"
      : cities.length > 10
      ? "cols-2"
      : "cols-1";

  return (
    <div
      className={`header-bar ${
        scrolled ? "header-solid" : "header-transparent"
      }`}
      style={{
        background: scrolled ? bgColor : "transparent",
      }}
    >
      {topBar()}

      <div className="header-inner container">
        {/* LOGO */}
        <div className="brand-wrapper">
          <img
            src="/assets/hotel-logo.jpeg"
            alt="Hotel Logo"
            className="brand-logo"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          />
        </div>

        {/* MAIN NAVIGATION */}
        <nav className="main-nav">
          <ul>
            {/* DROPDOWN LIST */}
            <li
              ref={dropdownRef}
              className="nav-item has-dropdown"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button className="nav-link">Find Your Hotel ▾</button>

              {dropdownOpen && (
                <div className="hotel-dropdown">
                  <div className="hotel-dropdown-header">
                    Popular Destinations
                  </div>

                  {/* GRID LIST OF CITIES FROM API */}
                  <div className={`hotel-dropdown-list ${gridClass}`}>
                    {cities.map((cityObj) => (
                      <span
                        key={cityObj.id}
                        className="city-item"
                        onClick={() => openCityDialog(cityObj)}
                        style={{ cursor: "pointer", color: "#cca15f" }}
                      >
                        {cityObj.name}
                      </span>
                    ))}
                  </div>

                  {/* <button className="hotel-dropdown-all">
                    View all hotels →
                  </button> */}
                </div>
              )}
            </li>

            {/* OTHER NAV BUTTONS */}
            <button
              className="nav-link"
              onClick={() =>
                navigate("/our-hotels", { state: { contactInfo } })
              }
            >
              Our Hotels
            </button>

            <button
              className="nav-link"
              onClick={() => navigate("/offers", { state: { contactInfo } })}
            >
              Offers
            </button>

            <button
              className="nav-link"
              onClick={() => navigate("/weddings", { state: { contactInfo } })}
            >
              Weddings
            </button>

            <button
              className="nav-link"
              onClick={() => navigate("/events", { state: { contactInfo } })}
            >
              Plan Your Events
            </button>

            <button
              className="nav-link"
              onClick={() => navigate("/blog", { state: { contactInfo } })}
            >
              Blog
            </button>

            {/* <button
              className="nav-link"
              onClick={() => navigate("/dining", { state: { contactInfo } })}
            >
              Dining
            </button> */}

            {/* <button
              className="nav-link"
              onClick={() => navigate("/news", { state: { contactInfo } })}
            >
              Media & News
            </button> */}

            <button className="nav-link" onClick={() => navigate("/partners")}>
              Partner With Us
            </button>
          </ul>
        </nav>

        {/* HAMBURGER + BOOK NOW */}
        <div className="header-cta">
          <button className="hamburger-btn" onClick={toggleMenu}>
            <FaBars />
          </button>

          <button
            className="book-now"
            onClick={() => {
              setShowBooking(false); // ⬅ hide booking
              setBookingOpen(true); // ⬅ open popup
            }}
          >
            BOOK NOW
          </button>
        </div>
      </div>

      {/* HAMBURGER MENU PANEL */}
      {menuOpen && (
        <div className="hamburger-dropdown">
          <Link to="/contact">Contact Us</Link>
          <Link to="/careers">Careers</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/investors">Investor Relations</Link>
          <Link to="/pridemart">Pride Mart</Link>
          <Link to="/about">About Us</Link>
        </div>
      )}

      {bookingOpen &&
        bookingDialog(
          setBookingOpen,
          setShowBooking,
          cities,
          setSelectedHotels,
          selectedHotels
        )}

      {/* CITY HOTELS POPUP */}
      <CityHotelsModal
        open={cityModalOpen}
        onClose={() => setCityModalOpen(false)}
        city={selectedCity}
        hotels={cityHotels}
      />
    </div>
  );

  // TOP BAR FUNCTION
  function topBar() {
    return (
      <div className="header-top">
        <div className="topbar-premium">
          <div className="topbar-inner container">
            <div className="topbar-left">
              <span className="topbar-item">
                <FaEnvelope /> {contactInfo.email}
              </span>
              <span className="topbar-item">
                <FaPhoneAlt /> For Reservation’s: {contactInfo.reservationPhone}
              </span>
            </div>

            <div className="topbar-right">
              <span className="topbar-tag">
                Luxury Hospitality · Since {contactInfo.companySince}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
