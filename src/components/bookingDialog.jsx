import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BookingDialog({
  setBookingOpen,
  setShowHeroBooking,
  cities,
  selectedHotels,
  setSelectedHotels,
}) {
  const navigate = useNavigate();

  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);

  const handleBookNow = () => {
    if (!selectedCity || !selectedHotel) {
      alert("Please select destination and hotel");
      return;
    }

    navigate("/booking", {
      state: {
        citySelect: selectedCity.name,
        hotelSelect: selectedHotel.name,
        hotelIdSelect: selectedHotel.hotelId,
      },
    });
  };

  return (
    <div className="booking-dialog-overlay">
      <div className="booking-dialog">
        {/* Close Button */}
        <button
          className="booking-dialog-close"
          onClick={() => {
            setBookingOpen(false);
            setShowHeroBooking(true);
          }}
        >
          ✕
        </button>

        <div className="booking-dialog-content">
          <div className="booking-box-row">
            {/* LOCATION */}
            <div className="booking-field">
              <label>Location</label>
              <select
                className="booking-input"
                onChange={(e) => {
                  const cityName = e.target.value;
                  const city = cities.find((c) => c.name === cityName);

                  setSelectedCity(city || null);
                  setSelectedHotel(null);
                  setSelectedHotels(city ? city.hotels : []);
                }}
              >
                <option value="">Select Your Destination</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            {/* HOTEL */}
            <div className="booking-field">
              <label>Hotel</label>
              <select
                className="booking-input"
                disabled={!selectedHotels.length}
                onChange={(e) => {
                  const hotelName = e.target.value;
                  const hotel = selectedHotels.find(
                    (h) => h.name === hotelName
                  );
                  setSelectedHotel(hotel || null);
                }}
              >
                <option value="">Select Your Hotel</option>
                {selectedHotels.map((hotel) => (
                  <option key={hotel.hotelId} value={hotel.name}>
                    {hotel.name}
                  </option>
                ))}
              </select>
            </div>

            {/* ACTIONS */}
            <div className="booking-actions">
              <div className="why-book">Why Book Direct?</div>

              <button
                className="booking-btn"
                onClick={handleBookNow}
                disabled={!selectedCity || !selectedHotel}
              >
                BOOK NOW
              </button>

              <div className="price-text">
                From <strong>6,435</strong> INR/Night
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
