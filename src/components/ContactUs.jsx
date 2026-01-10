import React from "react";
import "./ContactUs.css";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaGlobe,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";

export default function ContactUs({ onClose }) {
  return (
    <div className="contact-overlay">
      <div className="contact-box">
        <button className="contact-close" onClick={onClose}>
          ✕
        </button>

        <h2 className="contact-title">Contact Us</h2>
        <p className="contact-subtitle">
          <strong>BHR Hotels India LLP</strong> <br />
          Delivering trusted hospitality since <strong>2010</strong>
        </p>

        <div className="contact-section">
          <h3>Reservations & Support</h3>

          <div className="contact-item">
            <FaPhoneAlt /> <span>+91 9211283334</span>
          </div>

          <div className="contact-item">
            <FaClock /> <span>Support Hours: 24×7</span>
          </div>
        </div>

        <div className="contact-section">
          <h3>Online Support</h3>

          <div className="contact-item">
            <FaEnvelope />
            <a href="mailto:info@bhrhotelsindia.com">info@bhrhotelsindia.com</a>
          </div>

          <div className="contact-item">
            <FaGlobe />
            <a
              href="https://www.bhrhotelsindia.com"
              target="_blank"
              rel="noreferrer"
            >
              www.bhrhotelsindia.com
            </a>
          </div>

          <div className="contact-item">
            <FaWhatsapp />
            <a
              href="https://wa.me/919211283334"
              target="_blank"
              rel="noreferrer"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>

        <div className="contact-section">
          <h3>Corporate Office</h3>

          <div className="contact-item">
            <FaMapMarkerAlt />
            <span>
              B-128, C-49, First Floor, Sector-2, <br />
              Noida, Gautam Buddha Nagar – 201301, India
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
