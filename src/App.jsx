import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import HotelList from "./pages/HotelList";
import OffersSection from "./pages/OffersSection";
import WeddingsSection from "./pages/WeddingsSection";
import EventsSection from "./pages/EventsSection";
import BlogSection from "./pages/BlogSection";
import DiningSection from "./pages/DiningSection";
import NewsSection from "./pages/NewsSection";
import PartnersSection from "./pages/PartnersSection";
import OurHotelsSection from "./pages/OurHotelsSection";
import DiningDetails from "./pages/DiningDetails";
import BlogDetail from "./pages/BlogDetail";
import HotelDetails from "./pages/HotelDetails.jsx";
// ... other pages

// ✅ Owner pages (NEW)
import OwnerLogin from "./owner/auth/OwnerLogin";
import OwnerDashboard from "./owner/pages/OwnerDashboard";
import HotelDashboard from "./owner/pages/HotelDashboard";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hotels" element={<HotelList />} />
        <Route path="/our-hotels" element={<OurHotelsSection />} />
        <Route path="/offers" element={<OffersSection />} />
        <Route path="/weddings" element={<WeddingsSection />} />
        <Route path="/events" element={<EventsSection />} />
        <Route path="/dining" element={<DiningSection />} />
        <Route path="/blog" element={<BlogSection />} />
        <Route path="/news" element={<NewsSection />} />
        <Route path="/partners" element={<PartnersSection />} />
        <Route path="/dining/:restaurantId" element={<DiningDetails />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/hotel-details/:city" element={<HotelDetails />} />
        {/* ================= OWNER ROUTES ================= */}
        <Route path="/owner/login" element={<OwnerLogin />} />
        <Route path="/owner/dashboard" element={<OwnerDashboard />} />
        <Route path="/owner/hotel/:hotelId" element={<HotelDashboard />} />
        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<h2>Page Not Found</h2>} />
        {/* ... */}
      </Routes>
    </>
  );
}
