import React from "react";
import { Link } from "react-router-dom";

export default function HotelCard({ hotel }) {
    return (
        <div
            style={{
                width: 300,
                borderRadius: 8,
                boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                overflow: "hidden",
                background: "#fff",
                margin: 12,
            }}
        >
            <div
                style={{
                    height: 180,
                    backgroundImage: `url(${hotel.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            />

            <div style={{ padding: 12 }}>
                <h3 style={{ margin: 0 }}>{hotel.name}</h3>
                <p style={{ margin: "6px 0", color: "#666" }}>{hotel.city}</p>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <div style={{ fontWeight: 700 }}>₹{hotel.price}/night</div>

                    <Link
                        to={`/hotels/${hotel.id}`}
                        style={{
                            background: "#1976d2",
                            color: "#fff",
                            padding: "8px 12px",
                            borderRadius: 6,
                            textDecoration: "none",
                        }}
                    >
                        View
                    </Link>
                </div>
            </div>
        </div>
    );
}
