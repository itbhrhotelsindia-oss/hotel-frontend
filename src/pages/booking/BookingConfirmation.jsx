import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./BookingConfirmation.css";

function BookingConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const booking =
    location.state?.booking ||
    JSON.parse(localStorage.getItem("confirmedBooking"));

  const roomTypeName =
    location.state?.roomTypeName ||
    JSON.parse(localStorage.getItem("bookingAvailability"))?.roomTypeName;

  useEffect(() => {
    if (!booking) {
      navigate("/booking");
    }
  }, [booking, navigate]);

  if (!booking) return null;

  /* ===============================
     ✅ RAZORPAY PAYMENT HANDLER
     =============================== */
  const handleRazorpayPayment = async () => {
    try {
      // ✅ 1️⃣ Create Razorpay order (QUERY PARAM ONLY)
      const res = await fetch(
        `${BASE_URL}/api/public/payments/razorpay/order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookingId: booking.bookingId,
          }),
        },
      );

      if (!res.ok) {
        const errText = await res.text();
        console.error("Order API failed:", errText);
        throw new Error("Order creation failed");
      }

      const orderData = await res.json();
      console.log("Order created:", orderData);

      // ✅ 2️⃣ Razorpay Checkout options
      const options = {
        key: orderData.keyId, // 🔐 FROM BACKEND
        amount: orderData.amount, // paise
        currency: orderData.currency,
        name: "BHR Hotels India",
        description: "Hotel Booking Payment",
        order_id: orderData.orderId,

        handler: function (response) {
          console.log("Payment success:", response);
          // Webhook will mark booking CONFIRMED
          navigate("/");
        },

        prefill: {
          name: booking.guestName || "Guest",
          email: booking.guestEmail || "guest@bhrhotelsindia.com",
          contact: booking.guestPhone || "9999999999",
        },

        theme: {
          color: "#6b2d2d",
        },
      };

      // ✅ 3️⃣ Open Razorpay popup
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error(err);
      alert("❌ Unable to initiate payment");
    }
  };

  return (
    <div className="confirmation-page">
      <div className="confirmation-card">
        <div className="success-box">
          <h3>🎉 Booking Created Successfully</h3>
          <p>
            Your booking is currently <strong>PENDING</strong>.
            <br />
            Please complete payment to confirm your reservation.
          </p>
        </div>

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

        {/* ✅ PAY BUTTON */}
        <div className="action-buttons">
          <button className="pay-btn" onClick={handleRazorpayPayment}>
            Pay ₹{booking.totalAmount} with Razorpay
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingConfirmation;
