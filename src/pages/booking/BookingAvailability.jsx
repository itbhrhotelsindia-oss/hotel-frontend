import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./BookingAvailability.css";
import GuestDetails from "./GuestDetails.jsx";

function BookingAvailability({ availability, search }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showGuestDetails, setShowGuestDetails] = useState(false);

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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

  // 4️⃣ Continue → Guest Details (NO NAVIGATION)
  const handleContinue = async () => {
    if (!guestName) {
      setError("Please Enter Name");
      return;
    }
    if (!guestEmail) {
      setError("Please Enter Email");
      return;
    }
    if (!guestPhone) {
      setError("Please Enter Phone");
      return;
    }
    // const bookingContext = {
    //   hotel: search.hotel,
    //   roomTypeName: search.roomTypeName,
    //   roomsRequested: availability.roomsRequested,
    //   totalAmount: availability.totalAmount,
    // };

    // console.log("hotelName:", search.hotelName);
    // localStorage.setItem("bookingAvailability", JSON.stringify(bookingContext));

    const hotelId = availability.hotelId;
    const roomTypeId = availability.roomTypeId;
    const checkIn = search.checkIn;
    const checkOut = search.checkOut;
    const rooms = availability.roomsRequested;
    const roomTypeName = search.roomTypeName;

    try {
      const res = await fetch(`${BASE_URL}/api/public/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotelId,
          roomTypeId,
          checkIn,
          checkOut,
          rooms,
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

      console.log("bookingData::::::::::::::::");
      navigate("/booking/confirmation", {
        state: { booking, roomTypeName },
      });

      console.log("Newwwwww::::::::::::::::");
    } catch (err) {
      setError("Unable to create booking. Please try again.");
    } finally {
      setLoading(false);
    }

    // setShowGuestDetails(bookingContext); // 👈 JUST SHOW BELOW
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
              {error && <p className="error-text">{error}</p>}
              <div className="details details-column">
                <label>Guest Name</label>
                <input
                  placeholder="Enter guest name"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                />

                <label>Email Address</label>
                <input
                  placeholder="Enter your email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                />

                <label>Phone Number</label>
                <input
                  placeholder="Enter your phone number"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                />
              </div>
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
