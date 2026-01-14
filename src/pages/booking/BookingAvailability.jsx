import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./BookingAvailability.css";
import GuestDetails from "./GuestDetails.jsx";

function BookingAvailability({ availability, search }) {
  const navigate = useNavigate();
  const location = useLocation();

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
  const [errors, setErrors] = useState({});
  // 3️⃣ Redirect safely if data missing
  useEffect(() => {
    if (!data) {
      navigate("/booking");
    }
  }, [data, navigate]);

  if (!data) return null;

  // 4️⃣ Continue → Guest Details (NO NAVIGATION)
  const handleContinue = async () => {
    const newErrors = {};

    if (!guestName.trim()) {
      newErrors.name = "Guest name is required";
    }

    if (!/^\S+@\S+\.\S+$/.test(guestEmail)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!/^[0-9]{10}$/.test(guestPhone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;
    // if (!guestName) {
    //   setError("Please Enter Name");
    //   return;
    // }
    // if (!guestEmail) {
    //   setError("Please Enter Email");
    //   return;
    // }
    // if (!guestPhone) {
    //   setError("Please Enter Phone");
    //   return;
    // }
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
  };

  return (
    <div className="availability-page">
      <h2 className="page-title">Available Rooms</h2>

      <div className="availability-layout">
        {/* LEFT */}
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

            {/* GUEST DETAILS */}
            <div className="details-column">
              {/* NAME */}
              <div className={`float-field ${errors.name ? "error" : ""}`}>
                <label>Guest Name</label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  required
                />
                {errors.name && (
                  <span className="error-text">{errors.name}</span>
                )}
              </div>

              {/* EMAIL */}
              <div className={`float-field ${errors.email ? "error" : ""}`}>
                <label>Email Address</label>
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  required
                />
                {errors.email && (
                  <span className="error-text">{errors.email}</span>
                )}
              </div>

              {/* PHONE */}
              <div className={`float-field ${errors.phone ? "error" : ""}`}>
                <label>Phone Number</label>
                <input
                  type="tel"
                  maxLength="10"
                  value={guestPhone}
                  onChange={(e) =>
                    setGuestPhone(e.target.value.replace(/\D/g, ""))
                  }
                  required
                />
                {errors.phone && (
                  <span className="error-text">{errors.phone}</span>
                )}
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

            {/* TOTAL */}
            <div className="total-row">
              <span>Total Amount</span>
              <span>₹{availability.totalAmount}</span>
            </div>

            <button className="continue-btn" onClick={handleContinue}>
              Continue Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingAvailability;
