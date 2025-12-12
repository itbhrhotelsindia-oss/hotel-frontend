import React from "react";

export function bookingDialog(
  setBookingOpen,
  setShowHeroBooking,
  cities,
  setSelectedHotels,
  selectedHotels
) {
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
                  const selected = cities.find((c) => c.name === cityName);
                  setSelectedHotels(selected ? selected.hotels : []);
                }}
              >
                <option>Select Your Destination</option>
                {cities.map((city) => (
                  <option key={city.id}>{city.name}</option>
                ))}
              </select>
            </div>

            {/* HOTELS */}
            <div className="booking-field">
              <label>Hotel</label>
              <select className="booking-input">
                <option>Select Your Hotel</option>
                {selectedHotels.map((hotel) => (
                  <option key={hotel.id}>{hotel.name}</option>
                ))}
              </select>
            </div>

            {/* BOOK BUTTON */}
            <div className="booking-actions">
              <div className="why-book">Why Book Direct?</div>
              <button className="booking-btn">BOOK NOW</button>
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
