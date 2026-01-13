import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./BookingAvailability.css";
import GuestDetails from "./GuestDetails.jsx";

function BookingAvailability({ availability, search }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showGuestDetails, setShowGuestDetails] = useState(false);

  // 1️⃣ Read data from router state
  const stateData = location.state;

  // 2️⃣ Fallback to localStorage (refresh-safe)
  const storedData = JSON.parse(localStorage.getItem("bookingAvailability"));

  const data = stateData || storedData;

  // 3️⃣ Redirect safely if data missing
  useEffect(() => {
    if (!data) {
      navigate("/booking");
    }
  }, [data, navigate]);

  if (!data) return null;
  console.log("availability data in BookingAvailability:", search);

  // 4️⃣ Continue → Guest Details (NO NAVIGATION)
  const handleContinue = () => {
    const bookingContext = {
      hotelId: availability.hotelId,
      roomTypeId: availability.roomTypeId,
      hotel: search.hotel,
      roomTypeName: search.roomTypeName,
      checkIn: search.checkIn,
      checkOut: search.checkOut,
      roomsRequested: availability.roomsRequested,
      totalAmount: availability.totalAmount,
    };

    console.log("hotelName:", search.hotelName);
    localStorage.setItem("bookingAvailability", JSON.stringify(bookingContext));

    setShowGuestDetails(bookingContext); // 👈 JUST SHOW BELOW
  };

  return (
    <div className="availability-page">
      <h2 className="page-title">Available Rooms</h2>

      {/* 🔹 HORIZONTAL WRAPPER */}
      <div className="availability-layout">
        {/* LEFT: Availability */}
        <div className="availability-left">
          <div className="availability-card">
            {/* SUMMARY */}
            <div className="summary">
              <p>
                <strong>Hotel:</strong> {search.hotel}
              </p>
              <p>
                <strong>Dates:</strong> {search.checkIn} → {search.checkOut}
              </p>
              <p>
                <strong>Rooms:</strong> {availability.roomsRequested} •
                <strong> Nights:</strong> {availability.nights}
              </p>
            </div>

            {/* PRICE BREAKDOWN */}
            <div className="breakup">
              <h4>Price Breakdown</h4>
              {availability.breakup.map((item, idx) => (
                <div className="breakup-row" key={idx}>
                  <span>{item.date}</span>
                  <span>₹{item.price}</span>
                </div>
              ))}
            </div>

            <div className="total-row">
              <span>Total Amount</span>
              <span>₹{availability.totalAmount}</span>
            </div>

            <button className="continue-btn" onClick={handleContinue}>
              Continue Booking
            </button>
          </div>
        </div>

        {/* RIGHT: Guest Details */}
        <div className="availability-right">
          {showGuestDetails && <GuestDetails bookingData={showGuestDetails} />}
        </div>
      </div>
    </div>
  );
}

export default BookingAvailability;
