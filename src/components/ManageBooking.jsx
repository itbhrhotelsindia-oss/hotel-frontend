import React, { useState } from "react";
import "./ManageBooking.css";

export default function ManageBooking({ onClose }) {
  const [bookingId, setBookingId] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!bookingId || !email) {
      setMessage("Please enter both Booking ID and Email.");
      return;
    }

    // API integration can be added here
    setMessage("Fetching booking details...");
  }

  return (
    <div className="manage-overlay">
      <div className="manage-box">
        <button className="manage-close" onClick={onClose}>
          ✕
        </button>

        <h1 className="manage-title">Manage Booking</h1>
        <p className="manage-subtitle">
          Retrieve or manage your reservation using your booking details
        </p>

        <form className="manage-form" onSubmit={handleSubmit}>
          <label>Booking ID*</label>
          <input
            type="text"
            placeholder="Enter your Booking ID"
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            required
          />

          <label>Email Address*</label>
          <input
            type="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" className="manage-btn">
            FIND BOOKING
          </button>
        </form>

        {message && <p className="manage-message">{message}</p>}

        <div className="manage-help">
          <p>
            Need assistance? Contact our support team at{" "}
            <a href="mailto:info@bhrhotelsindia.com">info@bhrhotelsindia.com</a>{" "}
            or call <strong>+91 9211283334</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
