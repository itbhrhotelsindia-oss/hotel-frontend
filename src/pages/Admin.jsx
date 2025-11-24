import React from "react";

export default function Admin() {
    return (
        <div>
            <h1>Admin Dashboard</h1>

            <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                <div style={{ flex: 1, padding: 18, background: "#fff", borderRadius: 8 }}>
                    <h3>Total Bookings</h3>
                    <div style={{ fontSize: 28, fontWeight: 700 }}>120</div>
                </div>

                <div style={{ flex: 1, padding: 18, background: "#fff", borderRadius: 8 }}>
                    <h3>Revenue</h3>
                    <div style={{ fontSize: 28, fontWeight: 700 }}>₹50,000</div>
                </div>
            </div>
        </div>
    );
}
