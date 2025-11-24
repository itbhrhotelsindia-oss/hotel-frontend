import React from "react";

export default function TopBar() {
    return (
        <div className="top-bar">
            <div className="top-inner">
                <div className="top-left" /> {/* reserved for left side if needed */}
                <div className="top-right">
                    <span className="top-item">✉️ abc@hotel.com</span>
                    <span className="top-item">📞 Toll Free Number: 1800 209 1400</span>
                </div>
            </div>
        </div>
    );
}
