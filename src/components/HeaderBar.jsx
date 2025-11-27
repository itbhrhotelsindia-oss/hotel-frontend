import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function HeaderBar() {
    const navigate = useNavigate();

    const handleFindHotelClick = (e) => {
        console.log('Find Your Hotel link clicked');
        // Optional: Add any additional logic here before navigation
        navigate('/hotels');
    };
    return (
        <div className="header-bar">
            <div className="header-inner">
                <div className="brand-wrapper">
                    <img src="/assets/hotel-logo.png" alt="Pride logo" className="brand-logo" />
                </div>

                <nav className="main-nav" aria-label="Main navigation">
                    <ul>
                        <li><Link to="/hotels" onClick={handleFindHotelClick}>Find Your Hotel ▾</Link></li>
                        <li><Link to="/hotels">Our Hotels</Link></li>
                        <li><Link to="/offers">Offers</Link></li>
                        <li><Link to="/weddings">Weddings</Link></li>
                        <li><Link to="/events">Plan Your Events</Link></li>
                        <li><Link to="/dining">Dining</Link></li>
                        <li><Link to="/news">Media & News</Link></li>
                        <li><Link to="/partners">Partner With Us</Link></li>
                    </ul>
                </nav>

                <div className="header-cta">
                    <button className="book-now">BOOK NOW</button>
                </div>
            </div>
        </div>
    );
}