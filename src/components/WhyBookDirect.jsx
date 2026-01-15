import React from "react";
import "./WhyBookDirect.css";
import {
  FaRupeeSign,
  FaHeadset,
  FaTags,
  FaClock,
  FaShieldAlt,
  FaStar,
} from "react-icons/fa";

export default function WhyBookDirect({ onClose }) {
  return (
    <div className="why-overlay">
      <div className="why-box">
        <button className="why-close" onClick={onClose}>
          ✕
        </button>

        <h1 className="why-title">Why Book Direct</h1>
        <p className="why-subtitle">
          Book directly with BHR Hotels India LLP and enjoy exclusive benefits
          designed for comfort, savings, and peace of mind.
        </p>

        <div className="why-grid">
          <div className="why-card">
            <FaRupeeSign />
            <h3>Best Price Guaranteed</h3>
            <p>
              Get the lowest available rates when you book directly with us,
              with no hidden charges.
            </p>
          </div>

          <div className="why-card">
            <FaTags />
            <h3>Exclusive Offers</h3>
            <p>
              Enjoy special deals, seasonal discounts, and value-added benefits
              available only on our website.
            </p>
          </div>

          <div className="why-card">
            <FaHeadset />
            <h3>Personalized Assistance</h3>
            <p>
              Speak directly with our reservations team for tailored support and
              customized stay experiences.
            </p>
          </div>

          <div className="why-card">
            <FaClock />
            <h3>Flexible Policies</h3>
            <p>
              Benefit from more flexible cancellation and modification options
              compared to third-party platforms.
            </p>
          </div>

          <div className="why-card">
            <FaShieldAlt />
            <h3>Secure & Trusted Booking</h3>
            <p>
              Your information is protected with secure payment gateways and
              trusted booking processes.
            </p>
          </div>

          <div className="why-card">
            <FaStar />
            <h3>Priority Guest Benefits</h3>
            <p>
              Direct bookers receive priority services, special requests
              handling, and exclusive privileges.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
