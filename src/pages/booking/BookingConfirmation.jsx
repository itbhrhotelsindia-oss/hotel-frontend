import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./BookingConfirmation.css";

function BookingConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // 1️⃣ Read booking from router OR localStorage (refresh-safe)
  const booking =
    location.state?.booking ||
    JSON.parse(localStorage.getItem("confirmedBooking"));

  const roomTypeName =
    location.state?.roomTypeName ||
    JSON.parse(localStorage.getItem("bookingAvailability"))?.roomTypeName;

  // 2️⃣ Redirect if no booking found
  useEffect(() => {
    if (!booking) {
      navigate("/booking");
    }
  }, [booking, navigate]);

  if (!booking) return null;

  const handleMockPaymentSuccess = async () => {
    try {
      await fetch(
        `${BASE_URL}/api/dev/payments/mock/success?bookingId=${booking.bookingId}`,
        { method: "POST" }
      );

      alert("✅ Payment Successful (Mock)");
      navigate("/booking/success");
    } catch (err) {
      alert("❌ Mock payment failed");
    }
  };

  const handleMockPaymentFailure = async () => {
    try {
      await fetch(
        `${BASE_URL}/api/dev/payments/mock/failure?bookingId=${booking.bookingId}`,
        { method: "POST" }
      );

      alert("❌ Payment Failed (Mock)");
      navigate("/booking/failure");
    } catch (err) {
      alert("❌ Mock payment failed");
    }
  };

  return (
    <div className="confirmation-page">
      {/* <h2 className="confirmation-title">Booking Confirmed</h2> */}

      <div className="confirmation-card">
        {/* SUCCESS */}
        <div className="success-box">
          <h3>🎉 Booking Created Successfully</h3>
          <p>
            Your booking is currently <strong>PENDING</strong>.
            <br />
            Please complete payment to confirm your reservation.
          </p>
        </div>

        {/* BOOKING DETAILS */}
        <div className="details-box">
          <h4>Booking Details</h4>

          <div className="detail-row">
            <span>Booking ID</span>
            <strong>{booking.bookingId}</strong>
          </div>

          <div className="detail-row">
            <span>Hotel ID</span>
            <strong>{booking.hotelId}</strong>
          </div>

          <div className="detail-row">
            <span>Room Type</span>
            <strong>{roomTypeName}</strong>
          </div>

          <div className="detail-row">
            <span>Check-In</span>
            <strong>{booking.checkIn}</strong>
          </div>

          <div className="detail-row">
            <span>Check-Out</span>
            <strong>{booking.checkOut}</strong>
          </div>

          <div className="detail-row">
            <span>Rooms</span>
            <strong>{booking.rooms}</strong>
          </div>

          <div className="detail-row total">
            <span>Total Amount</span>
            <strong>₹{booking.totalAmount}</strong>
          </div>
        </div>

        {/* CTA */}
        <div className="action-buttons">
          <button className="pay-btn" onClick={handleMockPaymentSuccess}>
            Mock Pay – Success
          </button>

          <button className="home-btn" onClick={handleMockPaymentFailure}>
            Mock Pay – Failure
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingConfirmation;
