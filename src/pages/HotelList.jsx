import React, { useState, useEffect } from "react";
import HotelCard from "../components/HotelCard";

const SAMPLE = [
    { id: "h1", name: "Pride Residency", city: "New Delhi", price: 4800, image: "/assets/hero2.png" },
    { id: "h2", name: "Pride Royal Palace", city: "New Delhi", price: 4300, image: "/assets/hero2.png" },
    { id: "h3", name: "Pride Residency 2", city: "New Delhi", price: 4300, image: "/assets/hero2.png" }
];

export default function HotelList() {   // <-- THIS FIXES YOUR ERROR
    const [hotels, setHotels] = useState([]);

    useEffect(() => {
        setHotels(SAMPLE);
    }, []);

    return (
        <div className="container">
            <h1>Hotels</h1>

            <div style={{ display: "flex", flexWrap: "wrap" }}>
                {hotels.map((h) => (
                    <HotelCard key={h.id} hotel={h} />
                ))}
            </div>
        </div>
    );
}
