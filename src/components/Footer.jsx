import React from "react";

export default function Footer() {
    return (
        <footer style={{
            marginTop: 40, padding: "24px 32px", borderTop: "1px solid #eee", textAlign: "center",
            background: "#fff", marginBottom: 20
        }}>
            © {new Date().getFullYear()} Hotel Booking Platform — All rights reserved.
        </footer>
    );
}
