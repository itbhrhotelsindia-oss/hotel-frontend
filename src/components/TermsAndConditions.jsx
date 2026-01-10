import React from "react";
import "./TermsAndConditions.css";

export default function TermsAndConditions({ onClose }) {
  return (
    <div className="terms-overlay">
      <div className="terms-box">
        <button className="terms-close" onClick={onClose}>
          ✕
        </button>

        <h1 className="terms-title">Terms & Conditions</h1>
        <p className="terms-updated">Last Updated: January 2026</p>

        <section className="terms-section">
          <h3>1. General</h3>
          <p>
            These Terms & Conditions govern your use of BHR Hotels India LLP’s
            website, services, and accommodations. By accessing or booking with
            us, you agree to comply with these terms.
          </p>
        </section>

        <section className="terms-section">
          <h3>2. Reservations & Bookings</h3>
          <p>
            All bookings are subject to availability and confirmation. Rates,
            inclusions, and policies may vary depending on the property, season,
            and selected plan.
          </p>
        </section>

        <section className="terms-section">
          <h3>3. Check-in & Check-out</h3>
          <p>
            Standard check-in and check-out times apply as per hotel policy.
            Early check-in or late check-out is subject to availability and may
            incur additional charges.
          </p>
        </section>

        <section className="terms-section">
          <h3>4. Cancellation & Refund Policy</h3>
          <p>
            Cancellation policies vary by property and booking type. Guests are
            advised to review cancellation terms at the time of booking.
            Refunds, if applicable, will be processed as per hotel policy.
          </p>
        </section>

        <section className="terms-section">
          <h3>5. Guest Responsibilities</h3>
          <p>
            Guests are expected to maintain decorum, respect hotel property, and
            follow all safety guidelines during their stay. Any damage caused
            may result in additional charges.
          </p>
        </section>

        <section className="terms-section">
          <h3>6. Privacy & Data Protection</h3>
          <p>
            Personal information shared with BHR Hotels is handled with strict
            confidentiality and used only to provide hospitality services, in
            accordance with applicable data protection laws.
          </p>
        </section>

        <section className="terms-section">
          <h3>7. Limitation of Liability</h3>
          <p>
            BHR Hotels India LLP shall not be held liable for loss, injury, or
            damage caused due to circumstances beyond reasonable control.
          </p>
        </section>

        <section className="terms-section">
          <h3>8. Modifications</h3>
          <p>
            BHR Hotels reserves the right to modify these Terms & Conditions at
            any time without prior notice. Continued use of our services implies
            acceptance of updated terms.
          </p>
        </section>
      </div>
    </div>
  );
}
