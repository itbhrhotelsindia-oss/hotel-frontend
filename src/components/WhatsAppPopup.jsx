import React, { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";
import "./WhatsAppPopup.css";

function WhatsAppPopup() {
  const [showPopup, setShowPopup] = useState(false);

  const phoneNumber = "919211283334"; // Replace
  const message = "Hello! Get instant booking support from our hotel team!";

  useEffect(() => {
    // Show popup after 3 seconds
    setTimeout(() => {
      setShowPopup(true);
    }, 3000);
  }, []);

  return (
    <div className="whatsapp-container">
      {/* {showPopup && (
        <div className="chat-popup">
          <div className="chat-header">
            Hotel Support
            <span className="close-btn" onClick={() => setShowPopup(false)}>
              ×
            </span>
          </div>

          <div className="chat-body">💬 Need help booking a room?</div>
        </div>
      )} */}

      <a
        href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-icon-button"
      >
        <FaWhatsapp size={25} />
      </a>
    </div>
  );
}

export default WhatsAppPopup;
