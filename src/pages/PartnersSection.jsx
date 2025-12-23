import React, { useState, useEffect } from "react";
import HeaderBar from "../components/HeaderBar.jsx";
import "./PartnerSection.css";
import Footer from "../components/Footer.jsx";
import { useLocation } from "react-router-dom";

export default function PartnersSection() {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const contactInfo = location.state?.contactInfo || {};
  const [showBooking, setShowBooking] = useState(true);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="offers-page">
      <HeaderBar
        scrolled={true}
        dropdownOpen={dropdownOpen}
        setDropdownOpen={setDropdownOpen}
        bgColor="#e8e8e8"
        contactInfo={contactInfo}
        setShowBooking={setShowBooking}
      />

      {/* Spacer so content does not hide behind sticky header */}
      <div style={{ height: "140px" }}></div>

      <h1 className="section-heading">
        <span
          className="line"
          style={{
            display: "inline-block",
            width: "100px",
            height: "3px",
            backgroundColor: "#cfa349",
            marginRight: "10px",
            marginBottom: "10px",
          }}
        />
        Partner With US
        <span
          className="line"
          style={{
            display: "inline-block",
            width: "100px",
            height: "3px",
            backgroundColor: "#cfa349",
            marginRight: "10px",
            marginBottom: "10px",
          }}
        />
      </h1>

      <p className="section-para">
        Join hands with one of India’s fastest-growing hospitality groups. Let’s
        create exceptional experiences together.
      </p>

      <div className="partner-container">
        {/* FORM SECTION */}
        <form className="partner-form">
          {/* Company Details */}
          <h2 className="section-title">Company Information</h2>

          <div className="form-row">
            <div className="form-group">
              <label>Company Name *</label>
              <input type="text" placeholder="Enter company name" required />
            </div>

            <div className="form-group">
              <label>Website</label>
              <input type="text" placeholder="https://www.example.com" />
            </div>
          </div>

          {/* Contact Person */}
          <h2 className="section-title">Primary Contact</h2>

          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input type="text" placeholder="Enter your name" required />
            </div>

            <div className="form-group">
              <label>Email ID *</label>
              <input type="email" placeholder="example@mail.com" required />
            </div>

            <div className="form-group">
              <label>Contact Number *</label>
              <input type="text" placeholder="Enter mobile number" required />
            </div>
          </div>

          {/* Partnership Type */}
          <h2 className="section-title">Partnership Type</h2>

          <div className="form-row">
            <div className="form-group full-width">
              <label>Select Partnership Category *</label>
              <select required>
                <option>Hotel Franchise</option>
                <option>Management Contract</option>
                <option>Investment Partnership</option>
                <option>Corporate Collaboration</option>
                <option>Vendor / Supplier Partnership</option>
                <option>Register Your Hotel</option>
              </select>
            </div>
          </div>

          <h2 className="section-title">Location</h2>

          <div className="form-row">
            <div className="form-group full-width">
              <label>Select Partnership Category *</label>
              <select required>
                <option>Noida</option>
                <option>Delhi</option>
                <option>Goa</option>
                <option>Haridwar</option>
                <option>Rishikesh</option>
                <option>Jim Corrbet</option>
              </select>
            </div>
          </div>

          {/* Additional Details */}
          <h2 className="section-title">Additional Details</h2>

          <div className="form-row">
            <div className="form-group full-width">
              <label>Message / Proposal *</label>
              <textarea
                placeholder="Tell us more about your proposal..."
                rows="5"
                required
              ></textarea>
            </div>
          </div>

          {/* Submit */}
          <button className="partner-submit-btn">Submit Application</button>
        </form>
      </div>

      <Footer contactInfo={contactInfo} />
    </main>
  );
}
