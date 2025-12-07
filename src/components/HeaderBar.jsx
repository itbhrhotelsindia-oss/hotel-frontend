import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function HeaderBar({ scrolled, dropdownOpen, setDropdownOpen, bgColor = "#ffffff" }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false); // ← NEW for Hamburger menu
  const dropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
     function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
       setDropdownOpen(false);
       }
     }
     document.addEventListener("mousedown", handleClickOutside);
     return () => document.removeEventListener("mousedown", handleClickOutside);
   }, []);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <div className={`header-bar ${scrolled ? "header-solid" : "header-transparent"}`}
      style={{
        background: scrolled ? bgColor : "transparent"
      }}>
       {topBar()}
      <div className="header-inner container">
       
        {/* Logo */}
        <div className="brand-wrapper">
          <img src="/assets/hotel-logo.jpeg" alt="Hotel Logo" className="brand-logo" />
        </div>

        {/* MAIN NAVIGATION */}
        <nav className="main-nav" aria-label="Main navigation">
          <ul>
            <li 
              ref={dropdownRef}
              className="nav-item has-dropdown"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button className="nav-link">Find Your Hotel ▾</button>

              {dropdownOpen && (
                <div className="hotel-dropdown" aria-hidden={!dropdownOpen}>
                  <div className="hotel-dropdown-header">Popular Destinations</div>
                  <div className="hotel-dropdown-list">
                    <Link to="/hotels/mumbai">Mumbai</Link>
                    <Link to="/hotels/delhi">Delhi</Link>
                    <Link to="/hotels/bangalore">Bengaluru</Link>
                    <Link to="/hotels/hyderabad">Hyderabad</Link>
                    <Link to="/hotels/goa">Goa</Link>
                    <Link to="/hotels/jaipur">Jaipur</Link>
                  </div>
                  <button className="hotel-dropdown-all">View all hotels →</button>
                </div>
              )}
            </li>

            <button className="nav-link" onClick={() => navigate("/our-hotels")}>Our Hotels </button>
            <button className="nav-link" onClick={() => navigate("/offers")}>Offers</button>
            <button className="nav-link" onClick={() => navigate("/weddings")}>Weddings</button>
            <button className="nav-link" onClick={() => navigate("/events")}>Plan Your Events</button>
            <button className="nav-link" onClick={() => navigate("/dining")}>Dining</button>
            <button className="nav-link" onClick={() => navigate("/news")}>Media & News</button>
            <button className="nav-link" onClick={() => navigate("/partners")}>Partner With Us</button>
          </ul>
        </nav>

        {/* HAMBURGER MENU + BOOK NOW */}
         <div className="header-cta">
         {/* Hamburger first */}
         <button className="hamburger-btn" onClick={toggleMenu}>
           ☰
        </button>

         {/* Then BOOK NOW */}
        <button className="book-now">BOOK NOW</button>
         </div>

      </div>

      {/* HAMBURGER MENU DROPDOWN */}
      {menuOpen && (
        <div className="hamburger-dropdown">
          <Link to="/contact">Contact Us</Link>
          <Link to="/careers">Careers</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/investors">Investor Relations</Link>
          <Link to="/pridemart">Pride Mart</Link>
          <Link to="/about">About Us</Link>
        </div>
      )}
    </div>
  );

  function topBar() {
    return <div className="header-top">
      <div className="topbar-premium" role="banner" aria-label="Top contact bar">
        <div className="topbar-inner container">
          <div className="topbar-left">
            <span className="topbar-item">✉️ info@bhrhotelsindia.com</span>
            <span className="topbar-item">📞 Toll Free: +91 921128334</span>
          </div>
          <div className="topbar-right">
            <span className="topbar-tag">Luxury Hospitality · Since 2010</span>
          </div>
        </div>
      </div>
    </div>;
  }
}
