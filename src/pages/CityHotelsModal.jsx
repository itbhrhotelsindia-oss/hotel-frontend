import "./CityModal.css";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function CityHotelsModal({ open, onClose, city, hotels }) {
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  if (!open) return null;

  return (
    <div className="city-modal-overlay">
      <div className="city-modal-box">
        <button onClick={onClose} className="close-btn">
          <FaTimes />
        </button>

        <h2 className="modal-title">{city}</h2>

        <div className="city-hotels-grid">
          {hotels.map((hotel, i) => (
            <div key={i} className="hotel-card">
              <img
                src={`${hotel.imageUrl}`}
                alt={hotel.name}
                className="modal-image"
              />
              <h3>{hotel.name}</h3>
              <p>From {hotel.price} INR/Night</p>
              <div className="hotel-services">
                {hotel.services.map((service, i) => (
                  <span key={i} className="service-badge">
                    {service === "MICE" && "🏨"}
                    {service === "Wedding" && "💍"}
                    {service === "Vacation" && "🌴"}
                    {service === "Safari" && "🦁"}
                    {service === "Nature Retreat" && "🌅"}
                    {service}
                  </span>
                ))}
              </div>
              <div className="hotel-card-btns">
                <button
                  className="visit-btn"
                  onClick={() => {
                    onClose(); // close modal
                    navigate(`/hotel-details/${hotel.hotelId}`);
                  }}
                >
                  Visit Hotel
                </button>
                <button className="book-btn">Book Now</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
