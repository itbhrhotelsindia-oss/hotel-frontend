import React from "react";
import { useParams, Link } from "react-router-dom";

const HERO_IMG = "/assets/hero2.png";

export default function HotelDetail() {
    const { id } = useParams();

    const hotel = {
        id,
        name: "Pride Plaza Aerocity",
        city: "New Delhi",
        price: 8600,
        image: HERO_IMG
    };

    return (
        <div className="container">
            <div
                style={{
                    height: 320,
                    borderRadius: 12,
                    overflow: "hidden",
                    marginBottom: 18
                }}
            >
                <img
                    src={hotel.image}
                    alt="hotel"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
            </div>

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >
                <div>
                    <h1 style={{ margin: 0 }}>{hotel.name}</h1>
                    <p style={{ marginTop: 6, color: "#666" }}>{hotel.city}</p>
                </div>

                <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 700, fontSize: 20 }}>₹{hotel.price}</div>
                    <Link
                        to={`/booking/${hotel.id}`}
                        style={{
                            display: "inline-block",
                            marginTop: 10,
                            background: "#1976d2",
                            color: "#fff",
                            padding: "8px 14px",
                            borderRadius: 8,
                            textDecoration: "none"
                        }}
                    >
                        Book Now
                    </Link>
                </div>
            </div>
        </div>
    );
}
