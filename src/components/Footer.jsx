import React from "react";
import "./Footer.css";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaUser
} from "react-icons/fa";

export default function Footer() {
  const cities = [
    "Ahmedabad","Alkapuri (Vadodara)","Bangalore","Becharaji","Bharuch","Bhopal",
    "Chennai","Chhatrapati Sambhajinagar","Daman","Dehradun","Deoghar","Digha",
    "Dwarka","Goa","Haldwani","Haridwar","Indore","Jaipur","Jodhpur"
  ];

  return (
    <footer className="footer-wrapper">
      <div className="footer-top container" style={{ display: "flex", alignItems: "center", gap: "2rem", paddingBottom: "4rem", borderBottom: "0px solid #ccc" }}>
         <div className="footer-middle">
          <h4 className="footer-heading">Get In Touch</h4>
          <div className="footer-social-large">
            <FaFacebookF />
            <FaLinkedinIn />
            <FaInstagram />
            <FaYoutube />
            <FaUser />
          </div>
        </div>
        
        <div className="footer-right">
          <h4 className="footer-heading">Subscribe Us</h4>
          <form className="footer-subscribe">
            <input type="email" placeholder="Please enter your email" />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>

      <div className="footer-top container" style={{ display: "flex", alignItems: "center", gap: "2rem", paddingBottom: "4rem", borderBottom: "0px solid #ccc" }}>
        <div className="footer-left">
          <img src="/assets/hotel-logo.jpeg" alt="Brand Logo" className="footer-logo" />
          <div className="footer-address">
            <h4>PRIDE HOTELS LIMITED</h4>
            <p>
              THE RUBY, 5TH FLOOR, OFFICE NO.5 SC, SOUTH WING ON LEVEL 8TH,
              SENAPATI BAPAT MARG, MUMBAI – 400 028
            </p>
            <p>EMAIL: centralreservations@pridehotel.com</p>
          </div>

          <div className="footer-socials">
            <FaFacebookF />
            <FaInstagram />
            <FaLinkedinIn />
            <FaYoutube />
          </div>
        </div>
        {/* --- CITY LIST --- */}
        <div className="footer-cities container">
          {cities.map((city, index) => (
            <span key={index} className="footer-city">
            {city} {index < cities.length - 1 && " | "}
          </span>
        ))}
        </div>
         {/* --- MENU LINKS --- */}
        <div className="footer-links container" style={{ display: "flex",paddingBottom: "1rem", borderBottom: "0px solid #ccc", flexWrap: "wrap" }}>
          <a href="/">Home</a>
          <a href="/hotels">Our Hotels</a>
          <a href="/about">About Us</a>
          <a href="/dining">Dining</a>
          <a href="/events">Plan Your Events</a>
          <a href="/weddings">Weddings</a>
          <a href="/why-book">Why Book Direct</a>
          <a href="/partners">Partner With Us</a>
          <a href="/careers">Careers</a>
          <a href="/news">Media & News</a>
          <a href="/contact">Contact Us</a>
          <a href="/terms">Terms & Conditions</a>
          <a href="/investors">Investor Relations</a>
          <a href="/booking">Manage Booking</a>
        </div>
      </div>

      {/* --- COOKIE BAR --- */}
      <div className="cookie-bar">
        This website uses cookies to ensure you get the best experience on our website.
        <button>Accept</button>
      </div>
    </footer>
  );
}
