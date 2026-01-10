import React, { useState, useEffect } from "react";
import "./Footer.css";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaLinkedinIn,
  FaCross,
} from "react-icons/fa";
import CityHotelsModal from "../pages/CityHotelsModal";
import ContactUs from "./ContactUs";
import TermsAndConditions from "./TermsAndConditions";
import WhyBookDirect from "./WhyBookDirect";
import AboutUs from "./AboutUs";
import Careers from "./Careers";
import ManageBooking from "./ManageBooking";

export default function Footer({ contactInfo = {} }) {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [cities, setCities] = useState([]);
  const [citiesLoading, setCitiesLoading] = useState(true);
  const handleSocialClick = (platform) => {
    const socialLinks = {
      facebook: contactInfo.socialLinks.facebook,
      instagram: contactInfo.socialLinks.instagram,
      youtube: contactInfo.socialLinks.youtube,
      twitterX: contactInfo.socialLinks.twitterX,
      linkedIn: contactInfo.socialLinks.linkedIn,
    };
    if (socialLinks[platform]) {
      window.open(socialLinks[platform], "_blank");
    }
  };

  const [selectedCity, setSelectedCity] = useState("");
  const [cityHotels, setCityHotels] = useState([]);
  const [cityModalOpen, setCityModalOpen] = useState(false);
  const openCityDialog = (cityObj) => {
    setSelectedCity(cityObj.name);
    setCityHotels(cityObj.hotels);
    setCityModalOpen(true);
  };
  const [activeDialog, setActiveDialog] = useState(null);

  function openDialog(type) {
    setActiveDialog(type);
  }

  function closeDialog() {
    setActiveDialog(null);
  }

  useEffect(() => {
    async function loadCities() {
      try {
        const res = await fetch(`${BASE_URL}/api/cities/`);
        if (!res.ok) throw new Error("Failed to fetch cities");

        const data = await res.json();
        setCities(data);
      } catch (err) {
        console.error("Cities API error:", err);
      } finally {
        setCitiesLoading(false);
      }
    }

    loadCities();
  }, []);

  return (
    <footer className="footer-wrapper">
      <div className="footer-top" style={{ borderBottom: "0px" }}>
        <div className="footer-left">
          <img
            src="/assets/hotel-logo.jpeg"
            alt="Brand Logo"
            className="footer-logo"
          />

          <div className="footer-address">
            <h4>{contactInfo.companyName}</h4>
            <p>{contactInfo.corporateAddress}</p>
            <p>EMAIL: {contactInfo.email}</p>
          </div>
        </div>

        <div className="footer-center">
          <h4 className="footer-heading">Get In Touch</h4>
          <div className="footer-social-large">
            <a
              onClick={() => handleSocialClick("facebook")}
              style={{ cursor: "pointer" }}
            >
              <FaFacebookF />
            </a>
            <a
              onClick={() => handleSocialClick("instagram")}
              style={{ cursor: "pointer" }}
            >
              <FaInstagram />
            </a>
            <a
              onClick={() => handleSocialClick("youtube")}
              style={{ cursor: "pointer" }}
            >
              <FaYoutube />
            </a>
            <a
              onClick={() => handleSocialClick("twitterX")}
              style={{ cursor: "pointer" }}
            >
              <FaTwitter />
            </a>
            <a
              onClick={() => handleSocialClick("linkedIn")}
              style={{ cursor: "pointer" }}
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        <div className="footer-right">
          <h4 className="footer-heading" style={{ marginTop: "20px" }}>
            Subscribe Us
          </h4>

          <form className="footer-subscribe">
            <input type="email" placeholder="Please enter your email" />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>

      <div
        className="footer-inner"
        style={{
          borderBottom: "2px solid #ccc",
        }}
      >
        {/* --- CITY LIST --- */}
        <div className="footer-cities container">
          {cities.map((city, index) => (
            <span
              key={city.id || index}
              className="footer-city"
              onClick={() => openCityDialog(city)}
              style={{ cursor: "pointer" }}
            >
              {city.name}
              {index < cities.length - 1 && " | "}
            </span>
          ))}
        </div>

        {/* --- MENU LINKS --- */}
      </div>

      <div
        className="footer-links container"
        style={{
          paddingBottom: "1rem",
          paddingTop: "2rem ",
          borderBottom: "0px",
        }}
      >
        <a href="/">Home</a>
        <span onClick={() => openDialog("about")}>About Us</span>
        <span onClick={() => openDialog("careers")}>Careers</span>
        <span onClick={() => openDialog("whyBook")}>Why Book Direct</span>
        <span onClick={() => openDialog("terms")}>Terms & Conditions</span>
        <span onClick={() => openDialog("booking")}>Manage Booking</span>
        <span onClick={() => openDialog("contact")}>Contact Us</span>
      </div>

      {/* --- COOKIE BAR --- */}
      {/* <div className="cookie-bar">
        This website uses cookies to ensure you get the best experience on our website.
        <button>Accept</button>
      </div> */}
      <InfoDialog
        type={activeDialog}
        onClose={closeDialog}
        contactInfo={contactInfo}
      />
      <CityHotelsModal
        open={cityModalOpen}
        onClose={() => setCityModalOpen(false)}
        city={selectedCity}
        hotels={cityHotels}
        contactInfo={contactInfo}
      />
    </footer>
  );
}

function InfoDialog({ type, onClose, contactInfo }) {
  if (!type) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        {type === "about" && <AboutUs onClose={onClose} />}
        {type === "careers" && <Careers onClose={onClose} />}
        {type === "whyBook" && <WhyBookDirect onClose={onClose} />}
        {type === "terms" && <TermsAndConditions onClose={onClose} />}
        {type === "booking" && <ManageBooking onClose={onClose} />}
        {type === "contact" && <ContactUs onClose={onClose} />}
      </div>
    </div>
  );
}
