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

// ── Owner portal ───────────────────────────────────────────────────────
import OwnerLogin from "./owner/auth/OwnerLogin";
import OwnerGuard from "./owner/auth/OwnerGuard";
import OwnerDashboard from "./owner/pages/OwnerDashboard";
import HotelDashboard from "./owner/pages/HotelDashboard";
import { RoomTypes } from "./owner/pages/RoomTypes";
import { Inventory } from "./owner/pages/Inventory";
import { HotelManagement } from "./owner/pages/HotelManagement";

// ── Super Admin portal ─────────────────────────────────────────────────
import SuperAdminGuard from "./superadmin/auth/SuperAdminGuard";
import SuperAdminDashboard from "./superadmin/pages/SuperAdminDashboard";
import AddHotelWizard from "./superadmin/pages/AddHotelWizard";
import SuperAdminHotelHub from "./superadmin/pages/SuperAdminHotelHub";
import AllBookings from "./superadmin/pages/AllBookings";

const JimcorbettLandingPage = lazy(
  () => import("./pages/landing/Jimcorbett.jsx"),
);

export default function App() {
  return (
    <>
      <Suspense fallback={null}>
        <Routes>
          {/* ── Public routes ─────────────────────────────────────── */}
          <Route path="/" element={<Home />} />
          <Route path="/jim-corbett-resort" element={<JimcorbettLandingPage />} />
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
          <Route path="/thank-you" element={<ThankYou />} />

          {/* ── Booking flow ───────────────────────────────────────── */}
          <Route path="/booking" element={<BookingSearch />} />
          <Route path="/booking/availability" element={<BookingAvailability />} />
          <Route path="/booking/guest-details" element={<GuestDetails />} />
          <Route path="/booking/confirmation" element={<BookingConfirmation />} />
          <Route path="/booking/success" element={<PaymentSuccess />} />
          <Route path="/booking/failure" element={<PaymentFailure />} />
          <Route path="/booking/atHotelPage" element={<PaymentAtHotelPage />} />

          {/* ── Legal ──────────────────────────────────────────────── */}
          <Route path="/legal" element={<LegalPage />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/refund-and-cancellation-policy" element={<RefundPolicy />} />

          {/* ── Auth (shared login) ────────────────────────────────── */}
          <Route path="/owner/login" element={<OwnerLogin />} />

          {/* ── Owner portal (OWNER role only) ────────────────────── */}
          <Route path="/owner/dashboard" element={<OwnerGuard><OwnerDashboard /></OwnerGuard>} />
          <Route path="/owner/hotels" element={<OwnerGuard><HotelManagement /></OwnerGuard>} />
          <Route path="/owner/hotel/:hotelId" element={<OwnerGuard><HotelDashboard /></OwnerGuard>} />
          <Route path="/owner/hotel/:hotelId/room-types" element={<OwnerGuard><RoomTypes /></OwnerGuard>} />
          <Route path="/owner/hotel/:hotelId/inventory" element={<OwnerGuard><Inventory /></OwnerGuard>} />

          {/* ── Super Admin portal (SUPER_ADMIN role only) ────────── */}
          <Route path="/superadmin/dashboard" element={<SuperAdminGuard><SuperAdminDashboard /></SuperAdminGuard>} />
          <Route path="/superadmin/hotels/new" element={<SuperAdminGuard><AddHotelWizard /></SuperAdminGuard>} />
          <Route path="/superadmin/hotel/:hotelId" element={<SuperAdminGuard><SuperAdminHotelHub /></SuperAdminGuard>} />
          <Route path="/superadmin/hotel/:hotelId/room-types" element={<SuperAdminGuard><RoomTypes /></SuperAdminGuard>} />
          <Route path="/superadmin/hotel/:hotelId/inventory" element={<SuperAdminGuard><Inventory /></SuperAdminGuard>} />
          <Route path="/superadmin/bookings" element={<SuperAdminGuard><AllBookings /></SuperAdminGuard>} />

          {/* ── Fallback ───────────────────────────────────────────── */}
          <Route path="*" element={<h2>Page Not Found</h2>} />
        </Routes>
      </Suspense>
      <WhatsAppPopup />
    </>
  );
}
