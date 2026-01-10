import React from "react";
import "./Careers.css";

export default function Careers({ onClose }) {
  return (
    <div className="careers-overlay">
      <div className="careers-box">
        <button className="careers-close" onClick={onClose}>
          ✕
        </button>

        <h1 className="careers-title">Careers</h1>
        <p className="careers-subtitle">
          Build a meaningful career in hospitality with BHR Hotels
        </p>

        <section className="careers-section">
          <h3>Why Join BHR Hotels?</h3>
          <p>
            At BHR Hotels India LLP, we believe our people are the heart of our
            success. We foster a collaborative work culture where passion,
            professionalism, and personal growth come together to create
            exceptional hospitality experiences.
          </p>
        </section>

        <section className="careers-section">
          <h3>What We Offer</h3>
          <ul className="careers-list">
            <li>Opportunities across hotels, resorts, and corporate offices</li>
            <li>A supportive and inclusive work environment</li>
            <li>Continuous learning and skill development</li>
            <li>Growth-oriented career paths in hospitality</li>
            <li>Exposure to diverse roles and destinations</li>
          </ul>
        </section>

        <section className="careers-section">
          <h3>Who We’re Looking For</h3>
          <p>
            We are always looking for passionate individuals who share our
            commitment to service excellence, teamwork, and guest satisfaction.
            Whether you are an experienced professional or just starting your
            journey, we welcome talent that is eager to learn and grow.
          </p>
        </section>

        <section className="careers-section">
          <h3>Apply With Us</h3>
          <p>
            To explore career opportunities with BHR Hotels, please share your
            updated resume and details with us at:
          </p>

          <p className="careers-email">
            📧{" "}
            <a href="mailto:careers@bhrhotelsindia.com">
              careers@bhrhotelsindia.com
            </a>
          </p>

          <p className="careers-note">
            Our HR team will get in touch with shortlisted candidates.
          </p>
        </section>
      </div>
    </div>
  );
}
