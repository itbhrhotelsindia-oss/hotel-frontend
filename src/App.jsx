import React, { lazy, Suspense } from "react";
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
import BookingSearch from "./pages/booking/BookingSearch";
import BookingAvailability from "./pages/booking/BookingAvailability";
import GuestDetails from "./pages/booking/GuestDetails";
import BookingConfirmation from "./pages/booking/BookingConfirmation";
import PaymentSuccess from "./pages/booking/PaymentSuccess";
import PaymentFailure from "./pages/booking/PaymentFailure";
import PaymentAtHotelPage from "./pages/booking/PaymentAtHotelPage";
import LegalPage from "./legal/LegalPage";
import TermsAndConditions from "./legal/TermsAndConditions";
import PrivacyPolicy from "./legal/PrivacyPolicy";
import RefundPolicy from "./legal/RefundPolicy";
import WhatsAppPopup from "./components/WhatsAppPopup";
import ThankYou from "./pages/ThankYou";
// ... other pages

// ✅ Owner pages (NEW)
import OwnerLogin from "./owner/auth/OwnerLogin";
import OwnerDashboard from "./owner/pages/OwnerDashboard";
import HotelDashboard from "./owner/pages/HotelDashboard";
import { RoomTypes } from "./owner/pages/RoomTypes";
import { Inventory } from "./owner/pages/Inventory";
const JimcorbettLandingPage = lazy(
  () => import("./pages/landing/Jimcorbett.jsx"),
);

export default function App() {
  return (
    <>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/jim-corbett-resort"
            element={<JimcorbettLandingPage />}
          />
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
          <Route path="/hotel-details/:hotelId" element={<HotelDetails />} />
          <Route path="/booking" element={<BookingSearch />} />
          <Route
            path="/booking/availability"
            element={<BookingAvailability />}
          />
          <Route path="/booking/guest-details" element={<GuestDetails />} />
          <Route
            path="/booking/confirmation"
            element={<BookingConfirmation />}
          />
          <Route path="/booking/success" element={<PaymentSuccess />} />
          <Route path="/booking/failure" element={<PaymentFailure />} />
          <Route path="/booking/atHotelPage" element={<PaymentAtHotelPage />} />
          <Route path="/thank-you" element={<ThankYou />} />

          {/* ================= OWNER ROUTES ================= */}
          <Route path="/owner/login" element={<OwnerLogin />} />
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          <Route path="/owner/hotel/:hotelId" element={<HotelDashboard />} />
          <Route
            path="/owner/hotel/:hotelId/room-types"
            element={<RoomTypes />}
          />
          <Route
            path="/owner/hotel/:hotelId/inventory"
            element={<Inventory />}
          />

          {/* ================= FALLBACK ================= */}
          <Route path="*" element={<h2>Page Not Found</h2>} />

          {/* ================= LEGAL ROUTES (MANDATORY) ================= */}
          <Route path="/legal" element={<LegalPage />} />
          <Route
            path="/terms-and-conditions"
            element={<TermsAndConditions />}
          />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route
            path="/refund-and-cancellation-policy"
            element={<RefundPolicy />}
          />

          {/* ... */}
        </Routes>
      </Suspense>
      <WhatsAppPopup />
    </>
  );
}
