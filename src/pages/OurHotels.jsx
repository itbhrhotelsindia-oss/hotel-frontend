import React, { useMemo, useState } from "react";

const HOTELS = [
  { id: 1, city: "Srinagar", name: "BHR Srinagar", state: "J&K", region: "North", x: 23, y: 12 },
  { id: 2, city: "Amritsar", name: "BHR Amritsar", state: "Punjab", region: "North", x: 34, y: 19 },
  { id: 3, city: "Jaipur", name: "BHR Jaipur", state: "Rajasthan", region: "North", x: 42, y: 40 },
  { id: 4, city: "Delhi", name: "BHR New Delhi", state: "Delhi", region: "North", x: 55, y: 35 },
  { id: 5, city: "Ahmedabad", name: "BHR Ahmedabad", state: "Gujarat", region: "West", x: 32, y: 55 },
  { id: 6, city: "Mumbai", name: "BHR Mumbai", state: "Maharashtra", region: "West", x: 40, y: 65 },
  { id: 7, city: "Goa", name: "BHR Goa", state: "Goa", region: "West", x: 35, y: 72 },
  { id: 8, city: "Kolkata", name: "BHR Kolkata", state: "West Bengal", region: "East", x: 73, y: 55 },
  { id: 9, city: "Hyderabad", name: "BHR Hyderabad", state: "Telangana", region: "South", x: 50, y: 68 },
  { id: 10, city: "Bengaluru", name: "BHR Bengaluru", state: "Karnataka", region: "South", x: 52, y: 78 },
];

const REGIONS = ["All", "North", "West", "South", "East"];

export default function OurHotels() {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("All");
  const [activeHotelId, setActiveHotelId] = useState(null);

  const filteredHotels = useMemo(() => {
    return HOTELS.filter((h) => {
      const matchesRegion = region === "All" || h.region === region;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        h.city.toLowerCase().includes(q) ||
        h.name.toLowerCase().includes(q) ||
        h.state.toLowerCase().includes(q);
      return matchesRegion && matchesSearch;
    });
  }, [search, region]);

  const activeHotel = HOTELS.find((h) => h.id === activeHotelId);

  return (
    <main className="our-hotels-page">
      {/* Hero heading */}
      <section className="our-hotels-hero">
        <h1 className="our-hotels-title">Our Destinations</h1>
        <p className="our-hotels-sub">
          Embark on a journey through the heart of India with BHR Hotels, where every destination
          blends vibrant culture, rich heritage, and warm Indian hospitality.
        </p>

        <div className="our-hotels-filters">
          <div className="oh-search">
            <input
              type="text"
              placeholder="Search by city, hotel or state"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="oh-region">
            <label>Region</label>
            <select value={region} onChange={(e) => setRegion(e.target.value)}>
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Layout: Map + sidebar */}
      <section className="our-hotels-layout">
        {/* MAP */}
        <div className="our-hotels-map">
          {/* Replace with your real image path */}
          <div className="oh-map-inner">
            <img
              src="/assets/india-map.jpg"
              alt="India map with BHR hotel locations"
              className="oh-map-img"
              draggable="false"
            />

            {filteredHotels.map((hotel) => (
              <button
                key={hotel.id}
                className={
                  "oh-pin" +
                  (hotel.id === activeHotelId ? " oh-pin-active" : "")
                }
                style={{
                  left: `${hotel.x}%`,
                  top: `${hotel.y}%`,
                }}
                onClick={() => setActiveHotelId(hotel.id)}
              >
                <span className="oh-pin-dot" />
                <span className="oh-pin-label">{hotel.city}</span>
              </button>
            ))}
          </div>

          {/* Floating tooltip card */}
          {activeHotel && (
            <div className="oh-pin-tooltip">
              <h3>{activeHotel.city}</h3>
              <p className="oh-pin-name">{activeHotel.name}</p>
              <p className="oh-pin-meta">
                {activeHotel.state} · {activeHotel.region} India
              </p>
              <button className="oh-view-btn">View Hotel →</button>
            </div>
          )}
        </div>

        {/* SIDEBAR LIST */}
        <aside className="our-hotels-list">
          <h2 className="oh-list-title">All Destinations</h2>
          <p className="oh-list-count">
            Showing <strong>{filteredHotels.length}</strong> of{" "}
            {HOTELS.length} locations
          </p>

          <div className="oh-list-scroll">
            {filteredHotels.map((hotel) => (
              <button
                key={hotel.id}
                className={
                  "oh-list-item" +
                  (hotel.id === activeHotelId ? " oh-list-item-active" : "")
                }
                onClick={() => setActiveHotelId(hotel.id)}
              >
                <div className="oh-list-city">{hotel.city}</div>
                <div className="oh-list-meta">
                  {hotel.state} • {hotel.region} India
                </div>
                <div className="oh-list-hotel-name">{hotel.name}</div>
              </button>
            ))}
            {filteredHotels.length === 0 && (
              <div className="oh-empty">
                No destinations found. Try clearing filters.
              </div>
            )}
          </div>
        </aside>
      </section>
    </main>
  );
}
