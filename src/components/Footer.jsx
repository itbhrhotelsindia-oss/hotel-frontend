import React, { useState, useEffect } from "react";
import "./Footer.css";
import { useNavigate } from "react-router-dom";

import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa";

import CityHotelsModal from "../pages/CityHotelsModal";
import ContactUs from "./ContactUs";
import WhyBookDirect from "./WhyBookDirect";
import AboutUs from "./AboutUs";
import Careers from "./Careers";
import ManageBooking from "./ManageBooking";

export default function Footer({ contactInfo = {} }) {
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const navigate = useNavigate();

  const [cities, setCities] = useState([]);

  const [selectedCity, setSelectedCity] = useState("");
  const [cityHotels, setCityHotels] = useState([]);
  const [cityModalOpen, setCityModalOpen] = useState(false);

  const [activeDialog, setActiveDialog] = useState(null);

  /* SOCIAL LINKS */

  const handleSocialClick = (platform) => {
    const socialLinks = {
      facebook: contactInfo?.socialLinks?.facebook,
      instagram: contactInfo?.socialLinks?.instagram,
      youtube: contactInfo?.socialLinks?.youtube,
      twitterX: contactInfo?.socialLinks?.twitterX,
      linkedIn: contactInfo?.socialLinks?.linkedIn,
    };

    if (socialLinks[platform]) {
      window.open(socialLinks[platform], "_blank");
    }
  };

  /* CITY DIALOG */

  const openCityDialog = (cityObj) => {
    setSelectedCity(cityObj.name);

    setCityHotels(cityObj.hotels);

    setCityModalOpen(true);
  };

  function openDialog(type) {
    setActiveDialog(type);
  }

  function closeDialog() {
    setActiveDialog(null);
  }

  /* LOAD CITIES */

  useEffect(() => {
    async function loadCities() {
      try {
        const res = await fetch(`${BASE_URL}/api/cities/`);

        const data = await res.json();

        setCities(data);
      } catch (err) {
        console.log(err);
      }
    }

    loadCities();
  }, []);

  return (
    <footer className="footer-wrapper">
      {/* TOP SECTION */}

      <div className="footer-top">
        {/* LOGO */}

        <div className="logo-col">
          <img src="/assets/hotel-logo.jpeg" className="footer-logo" />
        </div>

        {/* BRAND */}

        <div className="brand-col">
          <h3>{contactInfo.companyName}</h3>

          <p className="brand-line">{contactInfo.brandLine}</p>

          <p className="address">{contactInfo.corporateAddress}</p>
        </div>

        {/* CONTACT */}

        <div className="contact-col">
          <h4>Contact</h4>

          <p>📞 Reservations: +91 7900008944</p>

          <p>📞 Travel Partner / Wedding: +91 9211283334</p>

          <p>📞 Corporate Tie-Ups: +91 9211283334</p>

          <p>📞 Hotel Registration: +91 9211283335</p>

          <p>📧 info@hotaality.com</p>

          <p>🕒 Support: 24x7</p>
        </div>

        {/* SUBSCRIBE */}

        <div className="subscribe-col">
          <h4>Subscribe</h4>

          <form className="footer-subscribe">
            <input type="email" placeholder="Enter Email" />

            <button>Subscribe</button>
          </form>
        </div>
      </div>

      {/* CITIES */}

      <div className="footer-cities-section">
        <h4 className="cities-title">Popular Cities</h4>

        <div className="footer-cities">
          {cities.map((city, index) => (
            <span
              key={city.id || index}
              className="footer-city"
              onClick={() => openCityDialog(city)}
            >
              {city.name}
            </span>
          ))}
        </div>
      </div>

      {/* LINKS */}

      <div className="footer-links-section">
        <div className="footer-links">
          <span onClick={() => navigate("/")}>Home</span>

          <span onClick={() => openDialog("about")}>About Us</span>

          <span onClick={() => openDialog("careers")}>Careers</span>

          <span onClick={() => openDialog("whyBook")}>Why Book Direct</span>

          <span onClick={() => openDialog("booking")}>Manage Booking</span>

          <span onClick={() => openDialog("contact")}>Contact Us</span>

          <span onClick={() => navigate("/terms-and-conditions")}>
            Terms and Conditions
          </span>

          <span onClick={() => navigate("/privacy-policy")}>
            Privacy Policy
          </span>

          <span onClick={() => navigate("/refund-and-cancellation-policy")}>
            Refund Policy
          </span>

          <button
            className="admin-btn"
            onClick={() => navigate("/owner/login")}
          >
            ADMIN
          </button>
        </div>
      </div>

      <InfoDialog type={activeDialog} onClose={closeDialog} />

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

function InfoDialog({ type, onClose }) {
  if (!type) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        {type === "about" && <AboutUs onClose={onClose} />}

        {type === "careers" && <Careers onClose={onClose} />}

        {type === "whyBook" && <WhyBookDirect onClose={onClose} />}

        {type === "booking" && <ManageBooking onClose={onClose} />}

        {type === "contact" && <ContactUs onClose={onClose} />}
      </div>
    </div>
  );
}
