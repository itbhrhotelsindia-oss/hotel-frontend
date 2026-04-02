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
          <strong>
            Hotaality Group of Hotels - A Brand of Hotaality RevTech Private
            Limited BHR Hotels India - A Brand of Hotaality RevTech Private
            Limited
          </strong>{" "}
          <br />
          Delivering trusted hospitality since <strong>2010</strong>
        </p>

        <div className="contact-section">
          <h3>Reservations & Support</h3>

          <div className="contact-item">
            <FaPhoneAlt /> <span>+91 7900008944</span>
          </div>

          <div className="contact-item">
            <FaClock /> <span>Support Hours: 24×7</span>
          </div>
        </div>

        <div className="contact-item">
          <FaEnvelope />
          <a href="mailto:info@hotaality.com">info@hotaality.com</a>
        </div>

        <div className="contact-item">
          <FaEnvelope />
          <a href="mailto:info@bhrhotelsindia.com">info@bhrhotelsindia.com</a>
        </div>

        <div className="contact-section">
          <h3>Corporate Office</h3>

          <div className="contact-item">
            <FaMapMarkerAlt />
            <span>
              898, 8th Floor, Gaur City Mall, Sector-4, <br />
              Greater Noida West, Gautam Buddha Nagar - 201306, India
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
