import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./BookingAvailability.css";

function BookingAvailability({ availability, search }) {
  const navigate = useNavigate();
  const location = useLocation();

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

  // 4️⃣ Continue → Guest Details
  const handleContinue = () => {
    const bookingContext = {
      hotelId: availability.hotelId,
      roomTypeId: availability.roomTypeId,
      hotelName: search.hotelName,
      roomTypeName: search.roomTypeName,
      checkIn: search.checkIn,
      checkOut: search.checkOut,
      roomsRequested: availability.roomsRequested,
      totalAmount: availability.totalAmount,
    };

    // 🔑 Persist booking data (VERY IMPORTANT)
    localStorage.setItem("bookingAvailability", JSON.stringify(bookingContext));

    navigate("/booking/guest-details", {
      state: bookingContext,
    });
  };

  return (
    <div className="availability-page">
      <div className="availability-row">
        <h2 className="page-title">Available Rooms</h2>

        <div className="availability-card">
          {/* SUMMARY */}
          <div className="summary">
            <p>
              <strong>Hotel:</strong> {search.hotelName}
            </p>
            <p>
              <strong>Dates:</strong> {search.checkIn} → {search.checkOut}
            </p>
            <p>
              <strong>Rooms:</strong> {availability.roomsRequested}
              {" • "}
              <strong>Nights:</strong> {availability.nights}
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

          {/* TOTAL */}
          <div className="total-row">
            <span>Total Amount</span>
            <span>₹{availability.totalAmount}</span>
          </div>

          {/* CTA */}
          <button className="continue-btn" onClick={handleContinue}>
            Continue Booking
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingAvailability;
