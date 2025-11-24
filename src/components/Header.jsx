import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
    return (
        <header
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 32px",
                boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
                background: "#fff",
                position: "sticky",
                top: 0,
                zIndex: 50,
            }}
        >
            <div style={{ fontWeight: 700, fontSize: 20 }}>HotelApp</div>

            <nav style={{ display: "flex", gap: 16 }}>
                <Link to="/">Home</Link>
                <Link to="/hotels">Hotels</Link>
                <Link to="/admin">Admin</Link>
            </nav>
        </header>
    );
}
