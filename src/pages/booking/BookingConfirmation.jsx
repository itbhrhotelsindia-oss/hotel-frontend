import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./BookingConfirmation.css";

function BookingConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // ✅ Booking data (state → fallback to localStorage)
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

  const isPayNow = booking.payMode === "PAY_NOW";
  const isPayAtHotel = booking.payMode === "PAY_AT_HOTEL";

  /* ===============================
     ✅ RAZORPAY PAYMENT HANDLER
     =============================== */
  const handleRazorpayPayment = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/public/payments/razorpay/order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookingId: booking.bookingId,
          }),
        },
      );

      if (!res.ok) throw new Error("ORDER_CREATION_FAILED");

      const orderData = await res.json();

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Hotaality Group of Hotels",
        description: "Hotel Booking Payment",
        order_id: orderData.orderId,

        handler: function () {
          navigate("/booking/success");
        },

        prefill: {
          name: booking.guestName,
          email: booking.guestEmail,
          contact: booking.guestPhone,
        },

        theme: { color: "#b08d44" },

        modal: {
          ondismiss: () => navigate("/booking/failure"),
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", () => {
        navigate("/booking/failure");
      });

      razorpay.open();
    } catch (err) {
      console.error(err);
      navigate("/booking/failure");
    }
  };

  return (
    <div className="confirmation-page">
      <div className="confirmation-card">
        {/* SUCCESS HEADER */}
        <div className="success-box">
          <h3>🎉 Booking Created Successfully</h3>
          <p>
            Your booking is currently <strong>PENDING</strong>.
            <br />
            {isPayNow
              ? "Please complete payment to confirm your reservation."
              : "Please pay at the hotel during check-in."}
          </p>
        </div>

        {/* DETAILS */}
        <div className="details-box">
          <h4>Booking Details</h4>

          <div className="detail-row">
            <span>Booking ID</span>
            <strong>{booking.bookingId}</strong>
          </div>

          <div className="detail-row">
            <span>Hotel Name</span>
            <strong>{booking.hotelName}</strong>
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

        {/* ACTION BUTTONS */}
        <div className="action-buttons">
          {isPayNow && (
            <button className="pay-btn" onClick={handleRazorpayPayment}>
              Pay ₹{booking.totalAmount} Now
            </button>
          )}

          {isPayAtHotel && (
            <button
              className="pay-btn"
              onClick={() =>
                navigate("/booking/atHotelPage", {
                  state: { amount: booking.totalAmount },
                })
              }
            >
              Pay ₹{booking.totalAmount} At Hotel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingConfirmation;
