import React, { useState } from "react";
import "./WeddingSection.css";

export default function EnquiryForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    queryFor: "",
    comments: "",
  });

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Form submitted!");
  }

  return (
    <section className="enquiry-section">
      <h2 className="enquiry-title">ENQUIRE NOW</h2>

      <form className="enquiry-form" onSubmit={handleSubmit}>
        {/* NAME */}
        <label>Name</label>
        <input
          type="text"
          name="name"
          placeholder="Enter Name Here"
          value={formData.name}
          onChange={handleChange}
        />

        {/* EMAIL */}
        <label>Email</label>
        <input
          type="email"
          name="email"
          placeholder="Enter Email Here"
          value={formData.email}
          onChange={handleChange}
        />

        {/* PHONE */}
        <label>Phone</label>
        <div className="phone-wrapper">
          <select className="phone-code">
            <option value="+91">🇮🇳 +91</option>
            <option value="+1">🇺🇸 +1</option>
            <option value="+44">🇬🇧 +44</option>
          </select>

          <input
            type="text"
            name="phone"
            placeholder="Enter Phone Here"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        {/* CITY */}
        <label>Your City</label>
        <input
          type="text"
          name="city"
          placeholder="Enter Your City Here"
          value={formData.city}
          onChange={handleChange}
        />

        {/* QUERY FOR */}
        <label>Query For</label>
        <select
          name="queryFor"
          value={formData.queryFor}
          onChange={handleChange}
        >
          <option value="">Select Your Hotel</option>
          <option value="Pride Plaza">Pride Plaza</option>
          <option value="Pride Premier">Pride Premier</option>
          <option value="Pride Resorts">Pride Resorts</option>
        </select>

        {/* COMMENTS */}
        <label>Comments</label>
        <textarea
          name="comments"
          rows="5"
          placeholder="Enter Comments/Query Here"
          value={formData.comments}
          onChange={handleChange}
        ></textarea>

        {/* SUBMIT BUTTON */}
        <button type="submit" className="submit-btn">
          SUBMIT
        </button>
      </form>

      {/* BOOK A SHOWAROUND BUTTON */}
      <div className="showaround-container">
        <button className="showaround-btn">BOOK A SHOWAROUND</button>
      </div>
    </section>
  );
}
