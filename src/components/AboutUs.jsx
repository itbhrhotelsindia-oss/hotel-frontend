import React from "react";
import "./AboutUs.css";

export default function AboutUs({ onClose }) {
  return (
    <div className="about-overlay">
      <div className="about-box">
        <button className="about-close" onClick={onClose}>
          ✕
        </button>

        {/* HEADER */}
        <div className="about-header">
          <h1>About BHR Hotels</h1>
          <p>
            Crafting memorable stays with warmth, elegance, and authentic
            hospitality across India.
          </p>
        </div>

        {/* CONTENT */}
        <div className="about-content">
          <section>
            <h2>Who We Are</h2>
            <p>
              BHR Hotels India LLP is a growing hospitality brand dedicated to
              delivering refined experiences through thoughtfully curated hotels
              and resorts. Since our inception, we have focused on blending
              comfort, culture, and personalized service.
            </p>
          </section>

          <section>
            <h2>Our Journey</h2>
            <p>
              Established in <strong>2010</strong>, BHR Hotels has expanded its
              presence across leisure destinations, pilgrimage cities, and
              business hubs—offering guests a seamless blend of modern luxury
              and local charm.
            </p>
          </section>

          <section>
            <h2>What Makes Us Different</h2>
            <ul>
              <li>✔ Carefully selected hotels & resorts</li>
              <li>✔ Personalized guest-centric service</li>
              <li>✔ Ideal venues for weddings, events & retreats</li>
              <li>✔ Strong focus on comfort, safety & cleanliness</li>
            </ul>
          </section>

          <section>
            <h2>Our Promise</h2>
            <p>
              Whether you are planning a family getaway, destination wedding,
              corporate event, or a peaceful retreat, BHR Hotels promises
              thoughtful hospitality and experiences that stay with you long
              after checkout.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
