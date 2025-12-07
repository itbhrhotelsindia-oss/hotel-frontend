import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import HotelList from "./pages/HotelList";
import OurHotels from "./pages/OurHotels";
import OffersSection from "./pages/OffersSection";
import WeddingsSection from "./pages/WeddingsSection";
import EventsSection from "./pages/EventsSection";
import DiningSection from "./pages/DiningSection";
import NewsSection from "./pages/NewsSection";
import PartnersSection from "./pages/PartnersSection";
// ... other pages

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hotels" element={<HotelList />} />
        <Route path="/our-hotels" element={<OurHotels />} />
        <Route path="/offers" element={<OffersSection />} />
        <Route path="/weddings" element={<WeddingsSection />} />
        <Route path="/events" element={<EventsSection />} />
        <Route path="/dining" element={<DiningSection />} />
        <Route path="/news" element={<NewsSection />} />
        <Route path="/partners" element={<PartnersSection />} />
        {/* ... */}
      </Routes>
    </>
  );
}
