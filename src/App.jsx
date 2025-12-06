import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import HotelList from "./pages/HotelList";
import OurHotels from "./pages/OurHotels";
import OffersSection from "./pages/OffersSection";
// ... other pages

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hotels" element={<HotelList />} />
        <Route path="/our-hotels" element={<OurHotels />} />
        <Route path="/offers" element={<OffersSection />} />
        {/* ... */}
      </Routes>
    </>
  );
}
