import React, { useEffect, useRef, useState } from "react";
import HeaderBar from "../components/HeaderBar.jsx";
import Footer from "../components/Footer.jsx";
import "./HotelDetails.css";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {
  FaSwimmingPool,
  FaChair,
  FaHome,
  FaUmbrellaBeach,
  FaMeetup,
  FaCoffee,
  FaCocktail,
  FaWifi,
  FaParking,
  FaSpa,
  FaCloudRain,
  FaChild,
  FaTasks,
} from "react-icons/fa";
import BookingSearchBox from "./BookingSearchBox.jsx";
import { FaShop } from "react-icons/fa6";

export default function HotelDetails() {
  const { hotelId } = useParams();
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const wrapperRef = useRef(null);

  const next = () => setIndex((i) => i + 1);
  const prev = () => setIndex((i) => i - 1);
  const [index, setIndex] = useState(1);
  const [transitionMs, setTransitionMs] = useState(100); // 1000 is for smooth sliding

  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showBooking, setShowBooking] = useState(true);
  const [roomTypes, setRoomTypes] = useState([]);

  const location = useLocation();
  const contactInfo = location.state?.contactInfo || {};
  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => setIndex((prev) => prev), 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function fetchHotelDetails() {
      try {
        const res = await fetch(`${BASE_URL}/api/hotel-details/${hotelId}`);

        if (!res.ok) {
          console.warn(`Hotel details not found for ${hotelId}`);
          setLoading(false);
          return;
        }

        const text = await res.text();
        if (!text) {
          console.warn("Empty response from hotel details API");
          setLoading(false);
          return;
        }

        const data = JSON.parse(text);
        setHotel(data);
      } catch (err) {
        console.error("Hotel Details API Error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchHotelDetails();
  }, [hotelId]);

  useEffect(() => {
    async function fetchRoomTypes() {
      try {
        const res = await fetch(
          `${BASE_URL}/api/room-types?hotelId=${hotelId}`,
        );
        if (!res.ok) {
          throw new Error("Failed to fetch room types");
        }
        const data = await res.json();
        setRoomTypes(data);
      } catch (err) {
        console.error("Room Types API Error:", err);
      }
    }

    fetchRoomTypes();
  }, [hotelId]);

  // autoplay
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => i + 1), 5000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    function scroll() {
      setScrolled(window.scrollY > 50);
    }
    window.addEventListener("scroll", scroll);
    return () => window.removeEventListener("scroll", scroll);
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "200px", textAlign: "center" }}>
        Loading hotel details...
      </div>
    );
  }

  if (!hotel) {
    return (
      <div style={{ padding: "100px 40px", textAlign: "center" }}>
        <h2>Hotel Details Not Found</h2>
        <p>The hotel details for ID: {hotelId} are not available.</p>
        <p>
          Please check if hotel details have been configured in the admin panel.
        </p>
      </div>
    );
  }

  const {
    basicInfo = {},
    hotelSlider = { images: [], title: "", subtitle: "" },
    services = [],
    aboutSection = {},
    roomsSection = { title: "Rooms & Suites", rooms: [] },
    amenitiesSection = { title: "Amenities", amenities: [] },
    gallerySection = {},
    policiesSection = {},
    locationSection = {},
    faqSection = {},
  } = hotel || {};

  return (
    <div className="page-home">
      <HeaderBar
        scrolled={true}
        dropdownOpen={dropdownOpen}
        setDropdownOpen={setDropdownOpen}
        contactInfo={contactInfo}
        setShowBooking={setShowBooking}
      />

      {hotel && imageSection()}

      {roomSection()}

      {hotel && servicesSection()}

      <Footer contactInfo={contactInfo} />
    </div>
  );

  function imageSection() {
    return (
      <div className="everleaf-wrapper">
        {/* IMAGE GRID */}
        <div className="el-grid">
          <img src={hotelSlider.images[0]} alt="Forest" />
          <img src={hotelSlider.images[1]} alt="Walk" />
          <img src={hotelSlider.images[2]} alt="Cabin" />
          <img src={hotelSlider.images[3]} alt="Room" />
        </div>

        {/* TEXT SECTION */}
        <section className="el-text-section">
          <h2>{hotelSlider.title}</h2>

          <p>{hotelSlider.subtitle}</p>
        </section>

        {showBooking && <BookingSearchBox />}
      </div>
    );
  }

  function roomSection() {
    const rooms = roomTypes.length ? roomTypes : roomsSection?.rooms || [];
    const title = roomTypes.length
      ? roomsSection?.title || "Rooms & Suites"
      : roomsSection?.title || "Rooms & Suites";

    return (
      <section className="rooms-section">
        <div className="rooms-header">
          <h4 className="rooms-subtitle">ROOMS & SUITES</h4>
          <h2 className="rooms-title">{title}</h2>
        </div>

        <div className="rooms-grid">
          {rooms.map((room) => (
            <div key={room.roomTypeId || room.id} className="room-card">
              <div className="room-image-wrapper">
                <img
                  src={room.images?.[0] || room.image || "/assets/img1.jpg"}
                  alt={room.name}
                  className="room-image"
                />
              </div>

              <div className="room-content">
                <div className="room-id">{room.roomTypeId || room.id}</div>
                <h3 className="room-name">{room.name}</h3>

                <p className="room-desc">{room.description}</p>

                {room.amenities?.length ? (
                  <div className="room-amenities">
                    {room.amenities.map((amenity) => (
                      <span key={amenity} className="room-amenity">
                        {amenity}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        {/* <div className="rooms-explore-wrapper">
          <button className="explore-btn">EXPLORE ALL →</button>
        </div> */}
      </section>
    );
  }

  function servicesSection() {
    return (
      <section className="rc-container">
        <h4 className="rc-subtitle">Hospitality That Goes Beyond Comfort</h4>
        <h2 className="rc-title">{amenitiesSection.title}</h2>

        <div className="rc-grid">
          {amenitiesSection.amenities.map((item) => (
            <div
              key={item.id}
              className={`rc-card ${item.highlight ? "rc-card-dark" : ""}`}
            >
              <div className="rc-icon">
                {item === "Swimming Pool" ? (
                  <FaSwimmingPool />
                ) : item === "Multi-Cuisine Restaurant" ? (
                  <FaUmbrellaBeach />
                ) : item === "Coworking Space" ? (
                  <FaChair />
                ) : item === "Homy & Cozy Place" ? (
                  <FaHome />
                ) : item === "Conference Hall" ? (
                  <FaMeetup />
                ) : item === "Brewery" ? (
                  <FaCocktail />
                ) : item === "Coffee" ? (
                  <FaCoffee />
                ) : item === "Kid-Zone" ? (
                  <FaChild />
                ) : item === "Souvenir shop" ? (
                  <FaShop />
                ) : item === "Rain Dance" ? (
                  <FaCloudRain />
                ) : item === "Serenity Spa & Yoga" ? (
                  <FaSpa />
                ) : item === "Activities" ? (
                  <FaTasks />
                ) : item === "Parking" ? (
                  <FaParking />
                ) : item === "Free Wifi" ? (
                  <FaWifi />
                ) : null}
              </div>
              <h3 className="rc-card-title">{item}</h3>
              <p className="rc-card-desc">
                {item === "Swimming Pool"
                  ? "Refresh and unwind in our beautifully maintained swimming pool, perfect for relaxation and leisure."
                  : item === "Multi-Cuisine Restaurant"
                    ? "Enjoy delightful culinary experiences with a range of thoughtfully prepared local and international dishes."
                    : item === "Coworking Space"
                      ? "Stay productive in a comfortable and well-equipped coworking environment designed for focus and flexibility."
                      : item === "Homy & Cozy Place"
                        ? "Experience the warmth of a homelike ambiance that makes every stay relaxing and comfortable."
                        : item === "Conference Hall"
                          ? "Host seamless meetings and events in our spacious conference hall with modern facilities."
                          : item === "Brewery"
                            ? "Savor freshly brewed beverages crafted to complement your moments of relaxation."
                            : item === "Coffee"
                              ? "Enjoy freshly brewed coffee served just the way you like, perfect for energizing your day."
                              : item === "Kid-Zone"
                                ? "A safe and fun-filled play area designed to keep children entertained and happy"
                                : item === "Souvenir shop"
                                  ? "Take home memorable keepsakes and locally inspired souvenirs from your stay"
                                  : item === "Rain Dance"
                                    ? "Enjoy lively rain dance experiences with music and refreshing moments of pure fun"
                                    : item === "Serenity Spa & Yoga"
                                      ? "Rejuvenate your body and mind with calming spa therapies and guided yoga sessions."
                                      : item === "Activities"
                                        ? "Engage in a variety of curated indoor and outdoor activities for all age groups."
                                        : item === "Parking"
                                          ? "Convenient and secure parking facilities for a hassle-free stay."
                                          : item === "Free Wifi"
                                            ? "Stay connected with complimentary high-speed WiFi throughout the property."
                                            : null}
              </p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  function sliderSection() {
    return (
      <section className="main-image-slider">
        <div
          className="main-image-slider-wrapper"
          ref={wrapperRef}
          style={{
            transform: `translateX(-${index * 100}%)`,
            transition: transitionMs
              ? `transform ${transitionMs}ms ease-in-out`
              : "none",
          }}
        >
          <div className="main-image-slide">
            <img src={home.heroImages[home.heroImages.length - 1]} />
          </div>

          {home.heroImages.map((src, i) => (
            <div key={i} className="main-image-slide">
              <img src={src} />
            </div>
          ))}

          <div className="main-image-slide">
            <img src={home.heroImages[0]} />
          </div>
        </div>

        <button className="slider-arrow left" onClick={prev}>
          ‹
        </button>
        <button className="slider-arrow right" onClick={next}>
          ›
        </button>

        {/* SHOW BOOKING BOX ONLY IF NOT IN POPUP MODE */}
        {showBooking && <BookingSearchBox />}

        <div className="slider-dots">
          {home.heroImages.map((_, i) => (
            <div
              key={i}
              className={`dot ${i + 1 === index ? "active" : ""}`}
              onClick={() => setIndex(i + 1)}
            />
          ))}
        </div>
      </section>
    );
  }
}
