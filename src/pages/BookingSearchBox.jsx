import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./BookingSearchBox.css";

export default function BookingSearchBox() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  const [locations, setLocations] = useState([]); // API cities list
  const [selectedLocation, setSelectedLocation] = useState("");
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);

  const handleBookNow = () => {
    if (!selectedLocation || !selectedHotel) return;

    navigate("/booking", {
      state: {
        citySelect: selectedLocation,
        hotelSelect: selectedHotel.name,
        hotelIdSelect: selectedHotel.hotelId,
      },
    });
  };

  // Load locations from API
  useEffect(() => {
    async function loadLocations() {
      try {
        const res = await fetch(`${BASE_URL}/api/cities/`);
        const data = await res.json();

        setLocations(data); // store entire city list
      } catch (err) {
        console.error("Cities API Error:", err);
      }
    }

    loadLocations();
  }, []);

  // When user selects location → load hotels
  useEffect(() => {
    if (!selectedLocation) {
      setHotels([]);
      return;
    }

    const matchedCity = locations.find(
      (c) => c.name.toLowerCase() === selectedLocation.toLowerCase(),
    );

    setHotels(matchedCity ? matchedCity.hotels : []);
  }, [selectedLocation, locations]);

  return (
    <div className="booking-box-container">
      <div className="booking-box">
        <div className="booking-row">
          {/* Location Dropdown */}
          <div className="field-group">
            <label>Location</label>
            <select
              className="input-select"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">Select Your Destination</option>

              {locations.map((loc) => (
                <option key={loc.id} value={loc.name}>
                  {/* {loc.name} ({loc.state}) */}
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Hotel Dropdown */}
          <div className="field-group">
            <label>Hotel</label>
            <select
              className="input-select"
              value={selectedHotel?.hotelId || ""}
              onChange={(e) => {
                const hotel = hotels.find((h) => h.hotelId === e.target.value);
                setSelectedHotel(hotel || null);
              }}
              disabled={!hotels.length}
            >
              <option value="">
                {hotels.length
                  ? "Select Your BHR Hotel"
                  : "Select location first"}
              </option>

              {hotels.map((hotel) => (
                <option key={hotel.hotelId} value={hotel.hotelId}>
                  {hotel.name}
                </option>
              ))}
            </select>
          </div>

          {/* Booking Section */}
          <div className="booking-actions">
            <div className="why-book">Why Book Direct?</div>
            <button
              className="booking-btn"
              onClick={handleBookNow}
              disabled={!selectedLocation || !selectedHotel}
            >
              BOOK NOW
            </button>

            {/* <div className="price-text">
              From <strong>6,435</strong> INR/Night
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
