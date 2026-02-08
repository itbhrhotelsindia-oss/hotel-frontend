import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BookingAvailability.css";

function BookingAvailability({ availability, search }) {
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [selectedPricing, setSelectedPricing] = useState(
    availability.pricingOptions[0],
  );

  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setSelectedPricing(availability.pricingOptions[0]);
  }, [availability]);

  const handleContinue = async () => {
    if (!guestName || !guestEmail || !guestPhone) {
      setError("Please fill all guest details");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${BASE_URL}/api/public/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotelId: availability.hotelId,
          roomTypeId: availability.roomTypeId,
          checkIn: search.checkIn,
          checkOut: search.checkOut,
          rooms: availability.roomsRequested,

          pricingType: selectedPricing.type,
          payMode: selectedPricing.payMode,
          pricePerNight: selectedPricing.pricePerNight,
          totalAmount: selectedPricing.totalAmount,

          guestName,
          guestEmail,
          guestPhone,
        }),
      });

      if (!res.ok) throw new Error("Booking failed");

      const booking = await res.json();
      localStorage.setItem("confirmedBooking", JSON.stringify(booking));

      navigate("/booking/confirmation", {
        state: { booking, roomTypeName: search.roomTypeName },
      });
    } catch (e) {
      setError("Unable to create booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="price-page">
      <h2 className="price-title">Choose Your Price</h2>

      {/* SUMMARY */}
      <div className="summary-box">
        <p>
          <b>Hotel:</b> {search.hotel}
        </p>
        <p>
          <b>Dates:</b> {search.checkIn} → {search.checkOut}
        </p>
        <p>
          <b>Rooms:</b> {availability.roomsRequested} • <b>Nights:</b>{" "}
          {availability.nights}
        </p>
      </div>

      {/* PRICING OPTIONS */}
      <div className="pricing-grid">
        {availability.pricingOptions.map((p, idx) => (
          <div
            key={idx}
            className={`pricing-card ${selectedPricing === p ? "active" : ""}`}
            onClick={() => setSelectedPricing(p)}
          >
            <h4>{p.type.replaceAll("_", " ")}</h4>
            <p className="paymode">{p.payMode.replaceAll("_", " ")}</p>
            <div className="price">₹{p.totalAmount}</div>
          </div>
        ))}
      </div>

      {/* GUEST DETAILS */}
      <div className="guest-box">
        <input
          placeholder="Guest Name"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
        />
        <input
          placeholder="Email"
          value={guestEmail}
          onChange={(e) => setGuestEmail(e.target.value)}
        />
        <input
          placeholder="Phone"
          value={guestPhone}
          maxLength={10}
          onChange={(e) => setGuestPhone(e.target.value.replace(/\D/g, ""))}
        />
      </div>

      {/* TOTAL */}
      <div className="total-box">
        <span>Total Amount</span>
        <strong>₹{selectedPricing.totalAmount}</strong>
      </div>

      {error && <p className="error-text">{error}</p>}

      <button
        className="continue-btn"
        onClick={handleContinue}
        disabled={loading}
      >
        {loading ? "Booking..." : "Continue Booking"}
      </button>
    </div>
  );
}

export default BookingAvailability;
