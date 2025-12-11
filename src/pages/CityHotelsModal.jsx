export default function CityHotelsModal({ open, onClose, city, hotels }) {
  if (!open) return null;

  return (
    <div className="city-modal-overlay">
      <div className="city-modal">
        <button onClick={onClose} className="close-btn">
          ✕
        </button>

        <h2>{city}</h2>

        <div className="city-hotels-list">
          {hotels.map((hotel, i) => (
            <div key={i} className="hotel-card">
              <img src={hotel.img} alt={hotel.name} />
              <h3>{hotel.name}</h3>
              <p>From {hotel.price} INR/Night</p>
              <button>Visit Hotel</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
