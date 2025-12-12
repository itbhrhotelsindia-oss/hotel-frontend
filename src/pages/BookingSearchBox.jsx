import React from "react";
import { FaTimes } from "react-icons/fa";
import "./BookingSearchBox.css";

export default function BookingSearchBox({ onClose }) {
  return (
    <div className="booking-box-wrapper">
      <div className="booking-box">
        {/* Close Button */}
        <button className="booking-close" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="booking-row">
          {/* LOCATION */}
          <div className="field-group">
            <label>Location</label>
            <select className="input-select">
              <option>Select Your Destination</option>
              <option>Mumbai</option>
              <option>Delhi</option>
              <option>Goa</option>
            </select>
          </div>

          {/* HOTEL */}
          <div className="field-group">
            <label>Hotel</label>
            <select className="input-select">
              <option>Select Your Pride Hotel</option>
              <option>Pride Plaza</option>
              <option>Pride Resort</option>
              <option>Pride Premium</option>
            </select>
          </div>

          {/* WHY BOOK DIRECT + BUTTON */}
          <div className="booking-actions">
            <div className="why-book">Why Book Direct?</div>

            <button className="booking-btn">BOOK NOW</button>
            <div className="price-text">
              From <strong>6,435</strong> INR/Night
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
