import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./BookingSearch.css";

function BookingSearch() {
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // ================= STATE =================
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [promo, setPromo] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const location = useLocation();

  const { citySelect, hotelSelect, hotelIdSelect } = location.state || {};

  const [place, setPlace] = useState(citySelect || "");
  const [hotel, setHotel] = useState(hotelSelect || "");

  console.log("citySelect::::::::::::::", citySelect);
  console.log("hotelSelect::::::::::::::", hotelSelect);
  console.log("hotelIdSelect::::::::::::::", hotelIdSelect);

  const [selectedHotel, setSelectedHotel] = useState(hotelSelect || "");
  const [selectedHotelId, setSelectedHotelId] = useState(hotelIdSelect || "");

  useEffect(() => {
    if (!hotelIdSelect) {
      console.warn("Booking page opened without hotel selection");
    }
  }, [hotelIdSelect]);
  // ================= TEMP ID MAPPING =================
  // (Later this will come from API)
  const HOTEL_ID_MAP = {
    "Clarissa Resort": "HOTEL-JIMCORBETT-001",
    "Pride Plaza Ahmedabad": "HOTEL-AHMEDABAD-001",
  };

  // TEMP: one room type (Deluxe)
  const ROOM_TYPE_ID = "694e44c29768c17c2164bcb7";

  // ================= API CALL =================
  const handleCheckAvailability = async () => {
    setError("");

    if (!place || !hotel || !checkIn || !checkOut) {
      setError("Please select place, hotel and dates");
      return;
    }

    const hotelId = HOTEL_ID_MAP[hotel];
    if (!hotelId) {
      setError("Invalid hotel selected");
      return;
    }

    const payload = {
      hotelId: hotelId,
      roomTypeId: ROOM_TYPE_ID,
      checkIn: checkIn,
      checkOut: checkOut,
      roomsRequested: adults,
    };

    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/public/availability`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!data.available) {
        setError("Rooms not available for selected dates");
        return;
      }

      // ✅ SUCCESS → MOVE TO STEP 2
      navigate("/booking/availability", {
        state: {
          availability: data,
          search: {
            place,
            hotel,
            hotelId,
            checkIn,
            checkOut,
            adults,
            children,
            promo,
            roomTypeId: ROOM_TYPE_ID,
          },
        },
      });
    } catch (err) {
      console.error("Availability API Error:", err);
      setError("Something went wrong while checking availability");
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================
  return (
    <div className="reservation-page">
      <h2 className="reservation-title">Reservations</h2>

      <div className="reservation-card">
        <div className="left-section">
          <h3>1. Search</h3>

          <div className="form-row">
            <div className="form-group">
              <label>Place</label>
              <select value={place} onChange={(e) => setPlace(e.target.value)}>
                <option value="">Select Place</option>
                <option value="Ahmedabad">Ahmedabad</option>
                <option value="Jim Corbett">Jim Corbett</option>
              </select>
            </div>

            <div className="form-group">
              <label>Hotel</label>
              <select value={hotel} onChange={(e) => setHotel(e.target.value)}>
                <option value="">Select Hotel</option>
                <option value="Pride Plaza Ahmedabad">
                  Pride Plaza Ahmedabad
                </option>
                <option value="Clarissa Resort">Clarissa Resort</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>From</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>To</label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group small">
              <label>Adults</label>
              <input
                type="number"
                min="1"
                value={adults}
                onChange={(e) => setAdults(+e.target.value)}
              />
            </div>

            <div className="form-group small">
              <label>Children</label>
              <input
                type="number"
                min="0"
                value={children}
                onChange={(e) => setChildren(+e.target.value)}
              />
            </div>
          </div>

          {error && <p className="error-text">{error}</p>}

          <div className="form-row">
            <input
              className="promo-input"
              placeholder="Promo Code"
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
            />
            <button
              className="check-btn"
              onClick={handleCheckAvailability}
              disabled={loading}
            >
              {loading ? "Checking..." : "Check Availability"}
            </button>
          </div>
        </div>

        <div className="right-section">
          <h4>Book now & pay directly at hotel</h4>
          <ul>
            <li>Use Promocode WEB5PL – extra ₹500 off</li>
            <li>Early Bird: Extra 10% Off</li>
            <li>Last Minute Deal: Extra 5% Off</li>
            <li>Hourly Rooms Available</li>
            <li>Bathtub (Deluxe & Suite rooms)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default BookingSearch;
