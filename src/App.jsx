import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import HotelList from "./pages/HotelList";
// ... other pages

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hotels" element={<HotelList />} />
        {/* ... */}
      </Routes>
    </>
  );
}
