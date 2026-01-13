import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./GuestDetails.css";

function GuestDetails({ bookingData }) {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const location = useLocation();

  // 1️⃣ Try to read from router state
  const stateData = location.state;

  // 2️⃣ Fallback to localStorage (IMPORTANT)
  const storedData = JSON.parse(localStorage.getItem("bookingAvailability"));

  // 3️⃣ If still missing → redirect safely
  useEffect(() => {
    if (!bookingData) {
      navigate("/booking");
    }
  }, [bookingData, navigate]);

  if (!bookingData) {
    return null; // prevents flicker
  }

  const {
    hotelId,
    hotel,
    roomTypeId,
    roomTypeName,
    checkIn,
    checkOut,
    roomsRequested,
    totalAmount,
  } = bookingData;

  console.log(
    "bookingData in GuestDetails:",
    hotelId,
    hotel,
    roomTypeId,
    roomTypeName,
    checkIn,
    checkOut,
    roomsRequested,
    totalAmount
  );
  // Guest form
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 4️⃣ Create booking API
  const handleConfirmBooking = async () => {
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
          hotelId,
          roomTypeId,
          checkIn,
          checkOut,
          rooms: roomsRequested,
          guestName,
          guestEmail,
          guestPhone,
        }),
      });

      if (!res.ok) {
        throw new Error("Booking failed");
      }

      const booking = await res.json();

      // Save bookingId for payment step
      localStorage.setItem("confirmedBooking", JSON.stringify(booking));

      navigate("/booking/confirmation", {
        state: { booking, roomTypeName },
      });
    } catch (err) {
      setError("Unable to create booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="guest-page">
      <h2 className="guest-title">Guest Information</h2>

      <div className="guest-card">
        <h4>Booking Summary</h4>
        <p>
          <strong>Hotel:</strong> {hotel}
        </p>
        <p>
          <strong>Dates:</strong> {checkIn} → {checkOut}
        </p>
        <p>
          <strong>Total:</strong> ₹{totalAmount}
        </p>

        <hr />

        {error && <p className="error-text">{error}</p>}

        <input
          placeholder="Guest Name"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
        />

        <input
          placeholder="Email Address"
          value={guestEmail}
          onChange={(e) => setGuestEmail(e.target.value)}
        />

        <input
          placeholder="Phone Number"
          value={guestPhone}
          onChange={(e) => setGuestPhone(e.target.value)}
        />

        <button
          className="confirm-btn"
          onClick={handleConfirmBooking}
          disabled={loading}
        >
          {loading ? "Booking..." : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
}

export default GuestDetails;
