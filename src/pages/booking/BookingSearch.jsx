import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./BookingSearch.css";
import BookingAvailability from "./BookingAvailability.jsx";

function BookingSearch() {
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // ================= STATE =================
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [numberOfRooms, setNumberOfRooms] = useState(1);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [promo, setPromo] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const location = useLocation();

  const { citySelect, hotelSelect, hotelIdSelect } = location.state || {};

  const [place, setPlace] = useState(citySelect || "");
  const [hotel, setHotel] = useState(hotelSelect || "");

  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState("");
  const [selectedRoomType, setSelectedRoomType] = useState(null);

  const [selectedHotel, setSelectedHotel] = useState(hotelSelect || "");
  const [selectedHotelId, setSelectedHotelId] = useState(hotelIdSelect || "");
  const today = new Date().toISOString().split("T")[0];

  const [cities, setCities] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [showAvailability, setShowAvailability] = useState(false);
  const [availabilityData, setAvailabilityData] = useState(null);
  const [searchData, setSearchData] = useState(null);

  useEffect(() => {
    async function loadCities() {
      try {
        const res = await fetch(`${BASE_URL}/api/cities/`);
        if (!res.ok) throw new Error("Failed to load cities");

        const data = await res.json();
        setCities(data);
      } catch (err) {
        console.error("Cities API Error:", err);
      }
    }

    loadCities();
  }, []);

  useEffect(() => {
    if (!place) {
      setHotels([]);
      setHotel("");
      setSelectedHotelId("");
      return;
    }

    const cityObj = cities.find(
      (c) => c.name.toLowerCase() === place.toLowerCase()
    );

    if (cityObj) {
      setHotels(cityObj.hotels || []);
    } else {
      setHotels([]);
    }
  }, [place, cities]);

  useEffect(() => {
    async function loadRoomTypes() {
      if (!selectedHotelId) {
        setRoomTypes([]);
        setSelectedRoomType(null);
        return;
      }

      try {
        const res = await fetch(
          `${BASE_URL}/api/admin/room-types?hotelId=${selectedHotelId}`
        );

        if (!res.ok) throw new Error("Failed to load room types");

        const data = await res.json();

        console.error("Room Type Data:", data);
        setRoomTypes(data);
      } catch (err) {
        console.error("Room Type API Error:", err);
      }
    }

    loadRoomTypes();
  }, [selectedHotelId]);

  useEffect(() => {
    if (!hotelIdSelect) {
      console.warn("Booking page opened without hotel selection");
    }
  }, [hotelIdSelect]);

  // ================= API CALL =================
  const handleCheckAvailability = async () => {
    setError("");

    if (!place || !hotel) {
      setError("Please select place and hotel");
      return;
    }

    if (!checkIn || !checkOut) {
      setError("Please select both check-in and check-out dates.");
      return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      setError("Check-out date must be after check-in date.");
      return;
    }

    const hotelId = selectedHotelId;

    if (!hotelId) {
      setError("Please select a valid hotel");
      return;
    }

    if (!selectedRoomTypeId) {
      setError("Please select a room type");
      return;
    }

    const payload = {
      hotelId,
      roomTypeId: selectedRoomTypeId,
      checkIn,
      checkOut,
      roomsRequested: numberOfRooms,
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

      setAvailabilityData(data);
      setSearchData({
        place,
        hotel,
        hotelId,
        checkIn,
        checkOut,
        adults,
        children,
        promo,
        roomTypeId: selectedRoomTypeId,
        roomTypeName: selectedRoomType?.name,
        pricePerNight: selectedRoomType?.pricePerNight,
      });
      setShowAvailability(true);

      // ✅ SUCCESS → MOVE TO STEP 2
      // navigate("/booking/availability", {
      //   state: {
      //     availability: data,
      //     search: {
      //       place,
      //       hotel,
      //       hotelId,
      //       checkIn,
      //       checkOut,
      //       adults,
      //       children,
      //       promo,
      //       roomTypeId: selectedRoomTypeId,
      //       roomTypeName: selectedRoomType?.name,
      //       pricePerNight: selectedRoomType?.pricePerNight,
      //     },
      //   },
      // });
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
          {/* <h3>1. Search</h3> */}

          <div className="form-row">
            <div className="form-group">
              <label>Place</label>
              <select value={place} onChange={(e) => setPlace(e.target.value)}>
                <option value="">Select Place</option>

                {cities.map((city) => (
                  <option key={city.id} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Hotel</label>
              <select
                value={selectedHotelId}
                onChange={(e) => {
                  const hotelId = e.target.value;
                  const hotelObj = hotels.find((h) => h.hotelId === hotelId);

                  setHotel(hotelObj ? hotelObj.name : "");
                  setSelectedHotelId(hotelId);

                  // 🔥 RESET room types
                  setSelectedRoomTypeId("");
                  setSelectedRoomType(null);
                }}
              >
                <option value="">Select Hotel</option>

                {hotels.map((hotel) => (
                  <option key={hotel.hotelId} value={hotel.hotelId}>
                    {hotel.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>From</label>
              <input
                type="date"
                name="checkIn"
                value={checkIn}
                min={today} // 👈 prevents past dates
                onChange={(e) => setCheckIn(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>To</label>
              <input
                type="date"
                name="checkOut"
                value={checkOut}
                min={checkIn || today}
                onChange={(e) => setCheckOut(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group small">
              <label>Number of Rooms</label>
              <input
                type="number"
                min="1"
                value={numberOfRooms}
                onChange={(e) => setNumberOfRooms(+e.target.value)}
              />
            </div>

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
          <div className="form-row">
            <div className="form-group">
              <label>Room Type</label>
              <select
                value={selectedRoomTypeId}
                onChange={(e) => {
                  const roomTypeId = e.target.value;
                  const roomTypeObj = roomTypes.find(
                    (rt) => rt.id === roomTypeId
                  );

                  setSelectedRoomTypeId(roomTypeId);
                  setSelectedRoomType(roomTypeObj || null);
                }}
                disabled={!roomTypes.length}
              >
                <option value="">
                  {roomTypes.length ? "Select Room Type" : "Select hotel first"}
                </option>

                {roomTypes.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedRoomType && (
            <div>
              <div className="price-preview">
                <strong>Price:</strong> ₹{selectedRoomType.basePrice} / night
              </div>

              <div className="price-preview">
                <strong>Max Guests:</strong> {selectedRoomType.maxGuests} per
                room
              </div>
            </div>
          )}

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
      {showAvailability && (
        <BookingAvailability
          availability={availabilityData}
          search={searchData}
        />
      )}
    </div>
  );
}

export default BookingSearch;
