import React from "react";
import "./Footer.css";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
} from "react-icons/fa";

export default function Footer() {
  const cities = [
    "Ahmedabad","Alkapuri (Vadodara)","Bangalore","Becharaji","Bharuch","Bhopal",
    "Chennai","Chhatrapati Sambhajinagar","Daman","Dehradun","Deoghar","Digha",
    "Dwarka","Goa","Haldwani","Haridwar","Indore","Jaipur","Jodhpur","Becharaji","Bharuch","Bhopal",
    "Chennai","Chhatrapati Sambhajinagar","Daman","Dehradun","Deoghar","Digha",
    "Dwarka","Goa","Haldwani","Haridwar","Indore","Jaipur","Jodhpur"
  ];

  return (
    <footer className="footer-wrapper">
      <div className="footer-top" style={{ borderBottom: "0px" }}>

        <div className="footer-left">
          <img src="/assets/hotel-logo.jpeg" alt="Brand Logo" className="footer-logo" />
          <div className="footer-address">
            <h4>BHR Hotels India LLP</h4>
            <p>
              Head Office : B-128, C-49, First Floor, Sector-2, Noida, Gautam Buddha Nagar - 201301, India
            </p>
            <p>EMAIL: info@bhrhotelsindia.com</p>
          </div>
        </div>

        <div className="footer-center">
        <h4 className="footer-heading">Our Social Presence</h4>
        <div className="footer-social-large">
            <FaFacebookF />
            <FaLinkedinIn />
            <FaInstagram />
            <FaYoutube />
            <FaUser />
        </div>

        <h4 className="footer-heading" style={{ marginTop: "20px" }}>
          Subscribe Us
        </h4>

        <form className="footer-subscribe">
          <input type="email" placeholder="Please enter your email" />
          <button type="submit">Subscribe</button>
        </form>
    </div>
 
      </div>
      

      <div className="footer-inner" style={{
        borderBottom: "2px solid #ccc",
      }}>
        
        {/* --- CITY LIST --- */}
        <div className="footer-cities container">
          {cities.map((city, index) => (
            <span key={index} className="footer-city">
            {city} {index < cities.length - 1 && " | "}
          </span>
        ))}
        </div>
         {/* --- MENU LINKS --- */}
       
      </div>

       <div className="footer-links container" style={{paddingBottom: "3rem", paddingTop: "3rem ", borderBottom: "0px" }}>
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

      {/* --- COOKIE BAR --- */}
      <div className="cookie-bar">
        This website uses cookies to ensure you get the best experience on our website.
        <button>Accept</button>
      </div>

    </footer>
  );
}
