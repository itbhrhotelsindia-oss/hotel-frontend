import React, { useState, useEffect } from "react";
import "./WeddingSection.css";

export default function EnquiryForm() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [cities, setCities] = useState([]);
  const [citiesLoading, setCitiesLoading] = useState(true);
  const [hotels, setHotels] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "",
    phone: "",
    city: "",
    queryFor: "",
    comments: "",
  });

  /* =========================
     LOAD CITIES FROM API
     ========================= */
  useEffect(() => {
    async function loadCities() {
      try {
        const res = await fetch(`${BASE_URL}/api/cities/`);
        if (!res.ok) throw new Error("Failed to fetch cities");

        const data = await res.json();
        setCities(data);
      } catch (err) {
        console.error("Cities API error:", err);
      } finally {
        setCitiesLoading(false);
      }
    }

    loadCities();
  }, []);
  // function handleChange(e) {
  //   setFormData({
  //     ...formData,
  //     [e.target.name]: e.target.value,
  //   });
  // }
  function handleChange(e) {
    const { name, value } = e.target;

    // CITY CHANGE → UPDATE HOTELS
    if (name === "city") {
      const selectedCity = cities.find((c) => c.name === value);

      setHotels(selectedCity ? selectedCity.hotels : []);

      setFormData((prev) => ({
        ...prev,
        city: value,
        queryFor: "", // reset hotel
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        countryCode: formData.countryCode,
        phone: formData.phone,
        city: formData.city,
        queryFor: formData.queryFor,
        comments: formData.comments,
      };

      const res = await fetch(`${BASE_URL}/api/weddings/enquiry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to submit wedding enquiry");
      }

      alert("Thank you! Our wedding team will contact you shortly.");

      // Reset form after success
      setFormData({
        name: "",
        email: "",
        countryCode: "+91",
        phone: "",
        city: "",
        queryFor: "",
        comments: "",
      });
      setHotels([]); // reset hotels list
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    }
  }

  return (
    <section className="enquiry-section">
      <h2 className="enquiry-title">ENQUIRE NOW</h2>

      <form className="enquiry-form" onSubmit={handleSubmit}>
        {/* NAME */}
        <label>Name*</label>
        <input
          type="text"
          name="name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        {/* EMAIL */}
        <label>Email</label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
        />

        {/* PHONE */}
        <label>Phone*</label>
        <div className="phone-wrapper">
          <select
            className="phone-code"
            name="countryCode"
            value={formData.countryCode}
            onChange={handleChange}
            required
          >
            <option value="+91">🇮🇳 +91</option>
          </select>

          <input
            type="text"
            name="phone"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        {/* CITY (API DRIVEN) */}
        <label>Your Location*</label>
        <select
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
        >
          <option value="">Select your location</option>

          {cities.map((city) => (
            <option key={city.id} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>

        {/* QUERY FOR */}
        <label>Hotel*</label>

        <select
          name="queryFor"
          value={formData.queryFor}
          onChange={handleChange}
          required
          disabled={!hotels.length}
        >
          <option value="">
            {hotels.length ? "Select Hotel" : "Select location first"}
          </option>

          {hotels.map((hotel) => (
            <option key={hotel.hotelId} value={hotel.name}>
              {hotel.name}
            </option>
          ))}
        </select>

        {/* COMMENTS */}
        <label>Comments</label>
        <textarea
          name="comments"
          rows="5"
          placeholder="Ask your query...."
          value={formData.comments}
          onChange={handleChange}
        ></textarea>

        {/* SUBMIT BUTTON */}
        <button type="submit" className="submit-btn">
          SUBMIT
        </button>
      </form>

      {/* BOOK A SHOWAROUND BUTTON */}
      {/* <div className="showaround-container">
        <button className="showaround-btn">BOOK A SHOWAROUND</button>
      </div> */}
    </section>
  );
}
